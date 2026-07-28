import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type } = body; // 'kpi' | 'portfolio' | 'alerts'

    const now = new Date().toLocaleString('id-ID', { dateStyle: 'long', timeStyle: 'short', timeZone: 'Asia/Jakarta' });

    let csv = '';

    if (type === 'kpi' || !type) {
      csv = [
        'FIFGROUP Digital Command Center — KPI Summary',
        `Exported: ${now}`,
        '',
        'Metric,Value,Change,Period',
        'MAU (FIFGO),234,000,+12%,MTD',
        'MAU (FIFADA),62,000,+8%,MTD',
        'Total Disbursement,Rp 89.2B,+18%,MTD',
        'Conversion Rate,8.2%,+0.6%,MTD',
        'Active Journeys,4,Live,MTD',
        'NPF Rate (All LoBs),2.1%,+0.1%,MTD',
        'PAR 30,4.8%,-0.2%,MTD',
        'Collection Rate,87.2%,-0.8%,MTD',
        'Push Open Rate,48%,+3%,MTD',
      ].join('\n');
    } else if (type === 'portfolio') {
      csv = [
        'FIFGROUP — Portfolio Quality Report',
        `As of: ${now}`,
        '',
        'LoB,Disbursement,NPF Rate,PAR30,PAR90,Collection %,Active Loans',
        `FIFASTRA,"Rp 38.4B",1.8%,3.9%,1.4%,91.2%,168,480`,
        `SPEKTRA,"Rp 4.2B",4.2%,9.1%,3.8%,78.4%,65,520`,
        `DANASTRA,"Rp 24.6B",2.3%,5.2%,2.1%,88.6%,142,740`,
        `FINATRA,"Rp 12.8B",1.9%,4.4%,1.7%,90.1%,105,300`,
        `AMITRA,"Rp 9.2B",2.8%,6.3%,2.6%,84.9%,121,680`,
        '',
        'Delinquency Bucket Summary',
        'Bucket,Outstanding,NPF Accounts',
        'Current (0 DPD),"Rp 892.0B",0',
        '1-30 DPD,"Rp 52.1B",3,248',
        '31-60 DPD,"Rp 27.3B",2,840',
        '61-90 DPD,"Rp 14.9B",1,920',
        '>90 DPD (NPF),"Rp 10.2B",4,210',
      ].join('\n');
    } else if (type === 'alerts') {
      csv = [
        'FIFGROUP — Alert Report',
        `Generated: ${now}`,
        '',
        'Alert,App,Severity,Current,Threshold,Status,Last Triggered',
        'FIFADA Crash Rate,FIFADA,CRITICAL,1.4%,>0.5%,triggered,22 Jul 2026',
        'FIFADA Error Rate,FIFADA,CRITICAL,1.4%,>1%,triggered,22 Jul 2026',
        'SPEKTRA NPF Rate,SPEKTRA,HIGH,4.2%,>4%,triggered,20 Jul 2026',
        'Push Delivery Rate,FIFADA,MEDIUM,94.2%,<95%,triggered,21 Jul 2026',
        'Bill Reminder,FIFGO,LOW,94%,<90%,resolved,18 Jul 2026',
        'Avg Days to Disburse,All LoBs,LOW,3.8 days,>5 days,resolved,15 Jul 2026',
      ].join('\n');
    }

    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="fifgroup-${type || 'kpi'}-report-${new Date().toISOString().split('T')[0]}.csv"`,
      },
    });
  } catch (err) {
    return NextResponse.json({ error: 'Export failed' }, { status: 500 });
  }
}
