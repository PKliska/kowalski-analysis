from fastapi import FastAPI, HTTPException
import itertools
import pandas as pd

import models

app = FastAPI()

projects = { }

def get_kth_element(possible_values, k):
    if len(possible_values) == 1:
        return [possible_values[0][k]]
    step = 1
    for i in possible_values[1:]:
        step *= len(i)
    n = k // step
    return [possible_values[0][n]] + get_kth_element(possible_values[1:], k % step)


@app.post("/{sampleId}/{low}/{high}/construct-csv")
async def constructCSV(sampleId: int, low: int, high: int, jsonProject: models.JSONProjectModel):
    test_point_collections = [collection
                              for collection in jsonProject.TestPointCollections
                              if sampleId in collection.SampleIds]
    input_condition_ids = list(set(
        [collection.InputConditionId
         for collection in test_point_collections]))
    input_condition_ids.sort()
    table_header = []
    possible_values = []
    for input_condition_id in input_condition_ids:
        for input_condition in jsonProject.Project.InputConditions:
            if input_condition.Id == input_condition_id:
                table_header.append(input_condition.Parameter)
                break
        values = []
        for collection in test_point_collections:
            if collection.InputConditionId == input_condition_id:
                values.extend(collection.TestPoints)
        possible_values.append(values)
    return [get_kth_element(possible_values, k) for k in range(low, high)]