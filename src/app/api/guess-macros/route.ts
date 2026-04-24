import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { meal } = await req.json();

    if (!meal) {
      return NextResponse.json({ error: 'Meal is required' }, { status: 400 });
    }

    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a nutrition expert. Estimate the macros for the given meal. Return ONLY a valid JSON object with {"protein": number, "carbs": number, "fat": number} representing the macros in grams. Do not include any other text, markdown formatting, or explanation.'
          },
          {
            role: 'user',
            content: meal
          }
        ]
      })
    });

    if (!openaiResponse.ok) {
      throw new Error(`OpenAI API error: ${openaiResponse.statusText}`);
    }

    const data = await openaiResponse.json();
    const content = data.choices[0].message.content.trim();
    
    // Remove potential markdown code blocks if the model ignored instructions
    const jsonStr = content.replace(/^```json\n?/, '').replace(/\n?```$/, '');
    
    const macros = JSON.parse(jsonStr);

    return NextResponse.json({
      protein: macros.protein || 0,
      carbs: macros.carbs || 0,
      fat: macros.fat || 0
    });

  } catch (error: any) {
    console.error('Error guessing macros:', error);
    return NextResponse.json({ error: 'Failed to estimate macros' }, { status: 500 });
  }
}
