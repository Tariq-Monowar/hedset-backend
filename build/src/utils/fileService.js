"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileService = void 0;
const fs_1 = __importDefault(require("fs"));
class FileService {
    static removeFile(filename) {
        const path = `${this.basePath}${filename}`;
        fs_1.default.existsSync(path) && fs_1.default.unlinkSync(path);
    }
    static removeFiles(filenames) {
        filenames.forEach(this.removeFile);
    }
    static removeFileByPath(path) {
        fs_1.default.existsSync(path) && fs_1.default.unlinkSync(path);
    }
}
exports.FileService = FileService;
FileService.basePath = "uploads/";
//# sourceMappingURL=fileService.js.map