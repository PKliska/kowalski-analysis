from fastapi import FastAPI
from pydantic import BaseModel

class SampleModel(BaseModel):
    FamilyName: str
    ProductName: str
    Name: str
    Id: int

class InputConditionModel(BaseModel):
    Parameter: str
    Min: float
    Typical: float
    Max: float
    TimeBetweenPoints: float
    Id: int

class ProjectModel(BaseModel):
    Name: str
    Samples: list[SampleModel]
    InputConditions: list[InputConditionModel]
    Id: int

class TestPointModel(BaseModel):
    Value: float
    Unit: str | None

class TestPointCollectionModel(BaseModel):
    InputConditionId: int
    SampleIds: list[int]
    TestPoints: list[TestPointModel]
    Id: int

class JSONProjectModel(BaseModel):
    Project: ProjectModel
    TestPointCollections: list[TestPointCollectionModel]

app = FastAPI()

@app.post("/load-project")
async def load(jsonProject: JSONProjectModel):
    return { "project-name": jsonProject.Project.Name }