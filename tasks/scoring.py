from datetime import date, datetime

def calculate_task_score(task_data):
    score = 0
    today = date.today()

    try:
        raw_date = task_data.get('due_date')
        if isinstance(raw_date, str):
            due_date = datetime.strptime(raw_date, "%Y-%m-%d").date()
        elif isinstance(raw_date, date):
            due_date = raw_date
        else:
            raise ValueError("No valid date")
    except (ValueError, TypeError):
        due_date = today

    days_until_due = (due_date - today).days

    if days_until_due < 0:
        score += 100
    elif days_until_due == 0:
        score += 80
    elif days_until_due <= 3:
        score += 50
    else:
        score += max(0, 20 - days_until_due)

    try:
        importance = int(task_data.get('importance', 5))
    except (ValueError, TypeError):
        importance = 5
    
    score += (importance * 5)

    try:
        hours = int(task_data.get('estimated_hours', 1))
    except (ValueError, TypeError):
        hours = 1

    if hours < 2:
        score += 10

    dependencies = task_data.get('dependencies', [])
    if isinstance(dependencies, list) and len(dependencies) > 0:
        score -= 30

    return score