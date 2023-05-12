from fastapi import FastAPI

import models

app = FastAPI()

projects = { }

@app.post("/load-project")
async def loadProject(jsonProject: models.JSONProjectModel):
    projects[jsonProject.Project.Id] = jsonProject
    return { "ProjectId": jsonProject.Project.Id }
