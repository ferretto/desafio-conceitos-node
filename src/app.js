const express = require("express");
const cors = require("cors");

const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

// LIST
app.get("/repositories", (request, response) => {
  response.json(repositories);
});

// CREATE
app.post("/repositories", (request, response) => {
  const { url, title, techs } = request.body;
  const repository = {
                        id: uuid(),
                        likes: 0,
                        url,
                        title,
                        techs
                      }
  repositories.push(repository);
  return response.json(repository);
});

// UPDATE
app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const { url, title, techs } = request.body;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if (repositoryIndex < 0) {
    return response.status(400).json({ error: 'Repository not found'})
  }

  const repository = {
    id,
    url,
    title,
    techs,
    likes: repositories[repositoryIndex].likes,
  }
  repositories[repositoryIndex] = repository

  return response.json(
    repositories[repositoryIndex]        
  );

});

// DELETE
app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if (repositoryIndex < 0) {
    return response.status(400).json({ error: 'Repository not found'})
  }

  repositories.splice(repositoryIndex,1);

  return response.status(204).send();


});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;
  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if (repositoryIndex < 0) {
    return response.status(400).json({ error: 'Repository not found'})
  }
  const repository = repositories[repositoryIndex]
  
  repository.likes += 1;

  repositories[repositoryIndex] = repository

  return response.status(200).json(repository);
  
 
});

module.exports = app;
