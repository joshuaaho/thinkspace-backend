import {
  DockerComposeEnvironment,
  StartedDockerComposeEnvironment,
  Wait,
} from "testcontainers";

let environment: StartedDockerComposeEnvironment;
export async function setup() {
  const composeFilePath = ".";
  const composeFile = "docker-compose.test.yml";

  environment = await new DockerComposeEnvironment(composeFilePath, composeFile)
    .withWaitStrategy("mongodb-test", Wait.forHealthCheck())
    .up();
}

export async function teardown() {
  await environment.stop();
}
