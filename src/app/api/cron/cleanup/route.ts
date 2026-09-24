// app/api/cron/cleanup/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  // التحقق من أن الطلب قادم من المصدر الموثوق
  if (req.headers.get('Authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  // ضع منطق المهمة هنا (مثلاً: حذف السجلات القديمة، إرسال إيميلات...)
  // await performCleanupTask();

  return NextResponse.json({ success: true, ranAt: new Date().toISOString() });
}