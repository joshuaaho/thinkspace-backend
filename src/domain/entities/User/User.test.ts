import User from "@domain/entities/User";
import { expect, it } from "vitest";
import Username from "./Username";
import Password from "./Password";
import Email from "./Email";
import Url from "@domain/common/Url";
import Work from "./Work";
import Bio from "./Bio";
import Education from "./Education";
import Interest from "./Interest";
import Location from "./Location";
import EntityId from "@domain/core/EntityId";
it("should create a user", () => {
  const id = EntityId.create("123");
  const username = Username.create("JohnDoe").unwrap();
  const email = Email.create("john.doe@example.com").unwrap();
  const password = Password.create({
    value: "StrongP@ss123",
  }).unwrap();
  const profileImgUrl = Url.create("https://test.com/profile.jpg").unwrap();
  const themePreference = "dark";
  const work = Work.create("Software Engineer").unwrap();
  const bio = Bio.create("I am a software engineer").unwrap();
  const education = Education.create(
    "Bachelor of Science in Computer Science",
  ).unwrap();
  const interest = Interest.create("Software Development").unwrap();
  const location = Location.create("New York, NY").unwrap();

  const user = User.create({
    id,
    username,
    email,
    password,
    profileImgUrl,
    themePreference,
    work,
    bio,
    education,
    interest,
    location,
  });

  expect(user.id.equals(id)).toBe(true);
  expect(user.username.equals(username)).toBe(true);
  expect(user.email.equals(email)).toBe(true);
  expect(user.password.equals(password)).toBe(true);
  expect(user.refreshToken).toBeUndefined();
  expect(user.themePreference).toEqual("dark");
  expect(user.profileImgUrl.equals(profileImgUrl)).toBe(true);
  expect(user.work?.equals(work)).toBe(true);
  expect(user.bio?.equals(bio)).toBe(true);
  expect(user.education?.equals(education)).toBe(true);
  expect(user.interest?.equals(interest)).toBe(true);
  expect(user.location?.equals(location)).toBe(true);
});

it("should create user with correct default values", () => {
  const username = Username.create("JohnDoe").unwrap();
  const email = Email.create("john.doe@example.com").unwrap();
  const password = Password.create({
    value: "StrongP@ss123",
  }).unwrap();

  const user = User.create({
    username,
    email,
    password,
  });

  expect(user.themePreference).toEqual("light");
  expect(user.profileImgUrl.value).toBeOneOf([
    "https://thinkspace1506.s3.us-east-1.amazonaws.com/70865fc6-d842-4993-9f80-de1223d40987.jpg",
    "https://thinkspace1506.s3.us-east-1.amazonaws.com/165e8069-2728-482b-a939-462a8c24af66.jpg",
  ]);
});
