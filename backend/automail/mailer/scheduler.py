def schedule_plan(plan):
    first_node = plan.nodes.order_by("order").first()
    if first_node:
      from .tasks import execute_node
      execute_node.delay(first_node.id)
    return first_node