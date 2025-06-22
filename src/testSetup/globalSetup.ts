import {
  DockerComposeEnvironment,
  StartedDockerComposeEnvironment,
  Wait,
} from "testcontainers";

let environment: StartedDockerComposeEnvironment;

export async function setup() {
  const composeFilePath = ".";
  const composeFile = "docker-compose.yml";

  environment = await new DockerComposeEnvironment(composeFilePath, composeFile)
    .withWaitStrategy("mongo1", Wait.forHealthCheck())
    .up();
}

export async function teardown() {
  await environment.stop();
}
