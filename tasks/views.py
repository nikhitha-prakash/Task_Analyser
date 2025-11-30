import json
from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .scoring import calculate_task_score

def index_view(request):
    return render(request, 'index.html')

@csrf_exempt
def analyze_tasks(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            analyzed_tasks = []
            for task in data:
                score = calculate_task_score(task)
                task['score'] = score
                analyzed_tasks.append(task)
            analyzed_tasks.sort(key=lambda x: x['score'], reverse=True)
            return JsonResponse(analyzed_tasks, safe=False)
        except:
            return JsonResponse({'error': 'Invalid JSON'}, status=400)
    return JsonResponse({'error': 'POST required'}, status=405)

@csrf_exempt
def suggest_tasks(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            analyzed_tasks = []
            for task in data:
                score = calculate_task_score(task)
                task['score'] = score
                analyzed_tasks.append(task)
            
            analyzed_tasks.sort(key=lambda x: x['score'], reverse=True)
            top_3 = analyzed_tasks[:3]
            
            response_data = {
                "message": "Focus on these 3 tasks to maximize productivity today.",
                "tasks": top_3
            }
            return JsonResponse(response_data)
        except:
            return JsonResponse({'error': 'Invalid JSON'}, status=400)
    return JsonResponse({'error': 'POST required'}, status=405)