import request from "supertest";
import type { NextFunction, Request, Response } from "express";
import { afterEach, describe, expect, it, jest } from "@jest/globals";
import { HTTP_STATUS } from "../src/constants/httpConstants";

jest.mock("../src/api/v1/services/itemService", () => ({
    __esModule: true,
    getAllItems: jest.fn(),
    createItem: jest.fn(),
    updateItem: jest.fn(),
    deleteItem: jest.fn(),
    getItemsById: jest.fn(),
}));

jest.mock("../src/api/v1/middleware/authenticate", () => {
    return {
        __esModule: true,
        default: jest.fn((_req: Request, _res: Response, next: NextFunction) => next()),
    };
});

jest.mock("../src/api/v1/middleware/authorize", () => {
    return {
        __esModule: true,
        default: jest.fn(
            (_options) => (_req: Request, _res: Response, next: NextFunction) => next()
        ),
    };
});

const app = jest.requireActual<typeof import("../src/app")>(
    "../src/app"
).default;
const itemService = jest.requireMock<typeof import("../src/api/v1/services/itemService")>(
    "../src/api/v1/services/itemService"
);

describe("Item Routes", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("GET /api/v1/items/", () => {
        it("should call getAllItems controller", async () => {
            jest.mocked(itemService.getAllItems).mockResolvedValue([]);
            await request(app).get("/api/v1/items/").set("Authorization", "Bearer mockedToken");
            expect(itemService.getAllItems).toHaveBeenCalled();
        });
    });

    describe("POST /api/v1/items/", () => {
        it("should call createItem controller with valid data", async () => {
            const mockItem = {
                name: "Test Item",
                description: "Test description",
            }; 

            jest.mocked(itemService.createItem).mockResolvedValue({
                id: "testId",
                name: mockItem.name,
                description: mockItem.description,
                createdAt: new Date(),
                updatedAt: new Date(),
            });
            await request(app).post("/api/v1/items/").set("Authorization", "Bearer mockedToken").send(mockItem);
            expect(itemService.createItem).toHaveBeenCalled();
        });
    });

    describe("PUT /api/v1/items/:id", () => {
        it("should call updateItem controller with valid data", async () => {
            const mockItem = {
                name: "Updated Item",
                description: "Updated description",
            }; 

            jest.mocked(itemService.updateItem).mockResolvedValue({
                id: "testId",
                name: mockItem.name,
                description: mockItem.description,
                createdAt: new Date(),
                updatedAt: new Date(),
            });
            await request(app).put("/api/v1/items/testId").set("Authorization", "Bearer mockedToken").send(mockItem);
            expect(itemService.updateItem).toHaveBeenCalledWith("testId", mockItem);
        });
    });

    describe("DELETE /api/v1/items/:id", () => {
        it("should call deleteItem controller with valid data", async () => {
            jest.mocked(itemService.deleteItem).mockResolvedValue();
            await request(app).delete("/api/v1/items/testId").set("Authorization", "Bearer mockedToken");
            expect(itemService.deleteItem).toHaveBeenCalledWith("testId");
        });
    });
})