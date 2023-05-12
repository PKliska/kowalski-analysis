from fastapi import FastAPI

import models

app = FastAPI()

@app.post("/load-project")
async def load(jsonProject: models.JSONProjectModel):
    return { "project-name": jsonProject.Project.Name }