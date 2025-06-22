import { describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import app from "@index";
import container from "@containers/index";
import IUserRepository from "@domain/repositories/IUserRepository";
import IPostRepository from "@domain/repositories/IPostRepository";
import CONSTANTS from "@containers/constants";
import {
  createUserOne,
  createPostOne,
  createPostTwo,
  createPostThree,
  createPostFour,
} from "@utils/testData/testEntities";

describe("Query Posts Route", () => {
  beforeEach(async () => {
    const testUser = createUserOne();
    const testPost = createPostOne();
    const testPostTwo = createPostTwo();
    const testPostThree = createPostThree();
    const testPostFour = createPostFour();

    const postRepository = container.get<IPostRepository>(
      CONSTANTS.PostRepository
    );
    const userRepository = container.get<IUserRepository>(
      CONSTANTS.UserRepository
    );
    await userRepository.save(testUser);
    await postRepository.save(testPost);
    await postRepository.save(testPostTwo);
    await postRepository.save(testPostThree);
    await postRepository.save(testPostFour);
  });
  describe("when querying posts with no query parameters", async () => {
    async function sendRequest() {
      const response = await request(app).get("/posts");
      return response;
    }

    it("should return 200 status", async () => {
      const response = await sendRequest();
      expect(response.status).toBe(200);
    });

    it("should return 4 posts (using default limit and offset values)", async () => {
      const response = await sendRequest();
      expect(response.body).toHaveLength(4);
    });
  });

  describe("when querying posts with limit parameter", async () => {
    async function sendRequest() {
      const response = await request(app).get("/posts").query({
        limit: 2,
      });

      return response;
    }
    it("should return 200 status", async () => {
      const response = await sendRequest();
      expect(response.status).toBe(200);
    });

    it("should return 2 posts", async () => {
      const response = await sendRequest();
      expect(response.body).toHaveLength(2);
    });
  });

  describe("when querying posts with title parameter", async () => {
    describe("using 'programming'", async () => {
      async function sendRequest() {
        const response = await request(app).get("/posts").query({
          title: "programming",
        });
        return response;
      }
      it("should return 200 status", async () => {
        const response = await sendRequest();
        expect(response.status).toBe(200);
      });

      it("should return 2 posts", async () => {
        const response = await sendRequest();
        expect(response.body).toHaveLength(2);
      });
    });

    describe("with 'typescript'", async () => {
      async function sendRequest() {
        const response = await request(app).get("/posts").query({
          title: "typescript",
        });
        return response;
      }

      it("should return 200 status", async () => {
        const response = await sendRequest();
        expect(response.status).toBe(200);
      });

      it("should return 1 posts", async () => {
        const response = await sendRequest();
        expect(response.body).toHaveLength(1);
      });
    });

    describe("with 'nonexistent title'", async () => {
      async function sendRequest() {
        const response = await request(app).get("/posts").query({
          title: "nonexistent title",
        });
        return response;
      }

      it("should return 200 status", async () => {
        const response = await sendRequest();
        expect(response.status).toBe(200);
      });

      it("should return 0 posts", async () => {
        const response = await sendRequest();
        expect(response.body).toHaveLength(0);
      });
    });
  });

  describe("with tag parameter ", async () => {
    describe("with 'typescript' and 'programming' tags", async () => {
      async function sendRequest() {
        const response = await request(app).get(
          "/posts?tags[0]=typescript&tags[1]=programming"
        );

        return response;
      }
      it("should return 200 status", async () => {
        const response = await sendRequest();
        expect(response.status).toBe(200);
      });

      it("should return 2 posts", async () => {
        const response = await sendRequest();
        expect(response.body).toHaveLength(2);
      });
    });
    describe("with 'typescript'  tags", async () => {
      async function sendRequest() {
        const response = await request(app).get("/posts?tags[0]=typescript");

        return response;
      }
      it("should return 200 status", async () => {
        const response = await sendRequest();
        expect(response.status).toBe(200);
      });

      it("should return 2 posts", async () => {
        const response = await sendRequest();
        expect(response.body).toHaveLength(1);
      });
    });
  });

  describe("when querying posts with sort parameter", async () => {
    describe("using 'newest'", async () => {
      async function sendRequest() {
        const response = await request(app).get("/posts").query({
          sortBy: "newest",
        });
        return response;
      }
      it("should return 200 status", async () => {
        const response = await sendRequest();

        expect(response.status).toBe(200);
      });

      it("should return 4 posts", async () => {
        const response = await sendRequest();
        expect(response.body).toHaveLength(4);
      });

      it("should return 4 posts in correct order (post 4, post 3, post 2, post 1)", async () => {
        const response = await sendRequest();

        expect(response.body[0].id).toBe("postFourId");
        expect(response.body[1].id).toBe("postThreeId");
        expect(response.body[2].id).toBe("postTwoId");
        expect(response.body[3].id).toBe("postOneId");
      });
    });

    describe("using 'oldest'", async () => {
      async function sendRequest() {
        const response = await request(app).get("/posts").query({
          sortBy: "oldest",
        });
        return response;
      }
      it("should return 200 status", async () => {
        const response = await sendRequest();

        expect(response.status).toBe(200);
      });

      it("should return 4 posts", async () => {
        const response = await sendRequest();
        expect(response.body).toHaveLength(4);
      });

      it("should return 4 posts in correct order (post 1, post 2, post 3, post 4)", async () => {
        const response = await sendRequest();
        expect(response.body[0].id).toBe("postOneId");
        expect(response.body[1].id).toBe("postTwoId");
        expect(response.body[2].id).toBe("postThreeId");
        expect(response.body[3].id).toBe("postFourId");
      });
    });

    describe("using 'most-liked'", async () => {
      async function sendRequest() {
        const response = await request(app).get("/posts").query({
          sortBy: "most-liked",
        });
        return response;
      }
      it("should return 200 status", async () => {
        const response = await sendRequest();

        expect(response.status).toBe(200);
      });

      it("should return 4 posts", async () => {
        const response = await sendRequest();
        expect(response.body).toHaveLength(4);
      });

      it("should return 4 posts in correct order (post 4 is most liked followed by post 1)", async () => {
        const response = await sendRequest();

        expect(response.body[0].id).toBe("postFourId");
        expect(response.body[1].id).toBe("postOneId");
      });
    });
  });
});
