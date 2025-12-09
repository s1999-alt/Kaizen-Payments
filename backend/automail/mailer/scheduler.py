def schedule_plan(plan):
  first_node = plan.nodes.order_by("order").first()
  if not first_node:
    print(f"[Scheduler] Plan {plan.id} has no nodes")
  return first_node
