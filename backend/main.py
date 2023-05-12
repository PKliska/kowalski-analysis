from fastapi import FastAPI

import models

app = FastAPI()

projects = { }

@app.post("/load-project")
async def loadProject(jsonProject: models.JSONProjectModel):
    projects[jsonProject.Project.Id] = jsonProject
    return { "ProjectId": jsonProject.Project.Id }

@app.get("/{id}/input-conditions")
async def getInputConditions(id: int):
    return { "InputConditions": projects[id].Project.InputConditions }

@app.get("/{id}/samples")
async def getSamples(id: int):
    return { "Samples": projects[id].Project.Samples }

@app.get("/{id}/test-point-collections")
async def getTestPointCollections(id: int):
    return { "TestPointCollections": projects[id].TestPointCollections }
