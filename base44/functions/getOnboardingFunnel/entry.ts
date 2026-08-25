import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
    if (user.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403 });

    const businesses = await base44.asServiceRole.entities.UserBusiness.list('-created_date', 1000);
    const items = await base44.asServiceRole.entities.ChecklistItem.list('-created_date', 5000);

    const totalSelected = businesses.length;

    const engagedIds = new Set();
    items.forEach((i) => { if (i.completed) engagedIds.add(i.user_business_id); });
    const reachedChecklist = engagedIds.size;

    const completed = businesses.filter((b) => b.status === 'completed').length;

    const byCountry = {};
    businesses.forEach((b) => {
      const cc = b.country_code || 'unknown';
      if (!byCountry[cc]) byCountry[cc] = { selected: 0, completed: 0 };
      byCountry[cc].selected++;
      if (b.status === 'completed') byCountry[cc].completed++;
    });

    return Response.json({
      totalSelected,
      reachedChecklist,
      completed,
      droppedOff: totalSelected - reachedChecklist,
      byCountry
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}