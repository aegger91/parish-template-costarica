import { createClient } from 'npm:@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

const ALLOWED_HOST = 'orthocal.info';

interface CalendarDay {
  year: number;
  month: number;
  day: number;
  [key: string]: unknown;
}

async function fetchCalendar(cal: string, path: string): Promise<CalendarDay | CalendarDay[]> {
  const upstream = new URL(`https://${ALLOWED_HOST}/api/${cal}${path}`);
  const res = await fetch(upstream.toString(), {
    headers: { Accept: 'application/json' },
  });
  if (!res.ok) {
    throw new Error(`Upstream returned ${res.status}`);
  }
  const data = (await res.json()) as CalendarDay | CalendarDay[];
  if (Array.isArray(data)) {
    for (const d of data) {
      if (typeof d.year !== 'number' || typeof d.month !== 'number' || typeof d.day !== 'number') {
        throw new Error('Malformed upstream data');
      }
    }
  } else {
    if (
      typeof data.year !== 'number' ||
      typeof data.month !== 'number' ||
      typeof data.day !== 'number'
    ) {
      throw new Error('Malformed upstream data');
    }
  }
  return data;
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  if (req.method !== 'GET') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    const url = new URL(req.url);
    const cal = url.searchParams.get('cal');
    const year = url.searchParams.get('year');
    const month = url.searchParams.get('month');
    const bypass = url.searchParams.get('refresh') === '1';

    if ((cal !== 'gregorian' && cal !== 'julian') || !year || !month) {
      return new Response(JSON.stringify({ error: 'Missing or invalid parameters' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const y = Number.parseInt(year, 10);
    const m = Number.parseInt(month, 10);
    if (!Number.isInteger(y) || y < 2000 || y > 2100 || !Number.isInteger(m) || m < 1 || m > 12) {
      return new Response(JSON.stringify({ error: 'Invalid date range' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    const cacheKey = `calendar/${cal}/${y}-${String(m).padStart(2, '0')}.json`;

    if (!bypass) {
      // Look for a cached copy first.
      const { data: existing, error: cacheErr } = await supabase.storage
        .from('site-cache')
        .download(cacheKey);

      if (cacheErr) {
        console.log('cache read failed:', JSON.stringify(cacheErr));
      }

      if (existing) {
        try {
          const cached = (await existing.json()) as { month: number; days: CalendarDay[] };
          if (cached && cached.month === m && Array.isArray(cached.days)) {
            return new Response(JSON.stringify(cached), {
              status: 200,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            });
          }
        } catch (parseErr) {
          console.log('cache parse failed:', String(parseErr));
        }
      }
    }

    const days = await fetchCalendar(cal, `/${y}/${m}/`);

    const payload = {
      calendar: cal,
      year: y,
      month: m,
      fetched_at: new Date().toISOString(),
      days,
    };

    // Store for future requests; a failed cache write must not break the response.
    await supabase.storage
      .from('site-cache')
      .upload(
        cacheKey,
        JSON.stringify(payload),
        { contentType: 'application/json', upsert: true },
      );

    return new Response(JSON.stringify(payload), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch {
    return new Response(JSON.stringify({ error: 'Calendar service unavailable' }), {
      status: 502,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
