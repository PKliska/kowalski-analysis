from fastapi import FastAPI
import itertools
import pandas as pd

import models

app = FastAPI()

projects = { }

@app.post("/{sampleId}/construct-csv")
async def constructCSV(sampleId: int, jsonProject: models.JSONProjectModel):
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
    
    return [len(i) for i in possible_values]

