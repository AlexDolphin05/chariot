/**
 * Legacy Bridge Notes — userkiller 桥接备忘（只适配，不迁移）。
 *
 * userkiller 是 Python Flask 后端 + React(JS) 前端 + Electron 壳。
 * Chariot 第一阶段不重写它的核心执行链（workflow_engine.py 的
 * PM → Planner → Preprocessor → Coder → Reviewer 五模块流水线）。
 *
 * 桥接方式：Chariot 通过 HTTP 直接调用其现有 API（backend/app.py）：
 *
 *   GET    /api/sessions                        列出会话
 *   POST   /api/sessions                        创建会话
 *   DELETE /api/sessions/<id>                   删除会话
 *   GET    /api/sessions/<id>/files             列出产物文件 → artifactLoader
 *   POST   /api/sessions/<id>/execute           执行工作流 → resumeSession
 *   GET    /api/sessions/<id>/status            轮询执行状态
 *   GET    /api/sessions/<id>/messages          会话消息
 *   GET    /api/templates                       模板列表
 *   POST   /api/templates/<id>/execute          用模板执行
 *   POST   /api/sessions/<id>/check-similar     相似模板检测
 *
 * 后续接入顺序建议：
 *   1. listSessions / openSession 用真实 GET /api/sessions 替换 mock
 *   2. loadAutomationArtifacts 接 GET /api/sessions/<id>/files
 *   3. resumeAutomationSession 接 POST /api/sessions/<id>/execute + status 轮询
 *   4. 模板语义（template_manager.py）暂缓，等会话闭环稳定后再接
 */
export const legacyBridgeBaseUrl = "http://localhost:5000"; // userkiller 默认端口，接入时确认
