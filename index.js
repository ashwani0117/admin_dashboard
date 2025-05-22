// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// server/storage.ts
var MemStorage = class {
  usersData;
  coursesData;
  roomsData;
  studentsData;
  attendancesData;
  leaveRequestsData;
  complaintsData;
  accessLogsData;
  userId = 1;
  courseId = 1;
  roomId = 1;
  studentId = 1;
  attendanceId = 1;
  leaveRequestId = 1;
  complaintId = 1;
  accessLogId = 1;
  constructor() {
    this.usersData = /* @__PURE__ */ new Map();
    this.coursesData = /* @__PURE__ */ new Map();
    this.roomsData = /* @__PURE__ */ new Map();
    this.studentsData = /* @__PURE__ */ new Map();
    this.attendancesData = /* @__PURE__ */ new Map();
    this.leaveRequestsData = /* @__PURE__ */ new Map();
    this.complaintsData = /* @__PURE__ */ new Map();
    this.accessLogsData = /* @__PURE__ */ new Map();
    this.createUser({
      username: "admin",
      password: "admin123",
      email: "admin@hostel.edu",
      userType: "admin"
    });
  }
  // User operations
  async getUser(id) {
    return this.usersData.get(id);
  }
  async getUserByUsername(username) {
    return Array.from(this.usersData.values()).find(
      (user) => user.username === username
    );
  }
  async createUser(insertUser) {
    const id = this.userId++;
    const createdAt = /* @__PURE__ */ new Date();
    const user = { ...insertUser, id, createdAt };
    this.usersData.set(id, user);
    return user;
  }
  async changePassword(userId, currentPassword, newPassword) {
    const user = await this.getUser(userId);
    if (!user || user.password !== currentPassword) {
      return false;
    }
    user.password = newPassword;
    this.usersData.set(userId, user);
    return true;
  }
  // Course operations
  async getAllCourses() {
    return Array.from(this.coursesData.values());
  }
  async getCourse(id) {
    return this.coursesData.get(id);
  }
  async createCourse(course) {
    const id = this.courseId++;
    const newCourse = { ...course, id };
    this.coursesData.set(id, newCourse);
    return newCourse;
  }
  async updateCourse(id, course) {
    if (!this.coursesData.has(id)) {
      return void 0;
    }
    const existingCourse = this.coursesData.get(id);
    const updatedCourse = { ...existingCourse, ...course };
    this.coursesData.set(id, updatedCourse);
    return updatedCourse;
  }
  async deleteCourse(id) {
    if (!this.coursesData.has(id)) {
      return false;
    }
    const studentsInCourse = Array.from(this.studentsData.values()).some(
      (student) => student.courseId === id
    );
    if (studentsInCourse) {
      throw new Error("Cannot delete course with enrolled students");
    }
    return this.coursesData.delete(id);
  }
  // Room operations
  async getAllRooms(floor, status) {
    let rooms2 = Array.from(this.roomsData.values());
    if (floor !== void 0) {
      rooms2 = rooms2.filter((room) => room.floor === floor);
    }
    if (status) {
      rooms2 = rooms2.filter((room) => room.status === status);
    }
    return rooms2;
  }
  async getRoom(id) {
    return this.roomsData.get(id);
  }
  async createRoom(room) {
    const id = this.roomId++;
    const newRoom = { ...room, id };
    this.roomsData.set(id, newRoom);
    return newRoom;
  }
  async updateRoom(id, room) {
    if (!this.roomsData.has(id)) {
      return void 0;
    }
    const existingRoom = this.roomsData.get(id);
    const updatedRoom = { ...existingRoom, ...room };
    this.roomsData.set(id, updatedRoom);
    return updatedRoom;
  }
  // Student operations
  async getAllStudents(courseId, roomId) {
    let students2 = Array.from(this.studentsData.values());
    if (courseId !== void 0) {
      students2 = students2.filter((student) => student.courseId === courseId);
    }
    if (roomId !== void 0) {
      students2 = students2.filter((student) => student.roomId === roomId);
    }
    return students2;
  }
  async getStudent(id) {
    return this.studentsData.get(id);
  }
  async createStudent(student) {
    const id = this.studentId++;
    const newStudent = { ...student, id };
    const room = await this.getRoom(student.roomId);
    if (room) {
      room.occupied += 1;
      if (room.occupied >= room.capacity) {
        room.status = "full";
      } else if (room.occupied > 0) {
        room.status = "partially occupied";
      }
      this.roomsData.set(room.id, room);
    }
    this.studentsData.set(id, newStudent);
    return newStudent;
  }
  async updateStudent(id, student) {
    if (!this.studentsData.has(id)) {
      return void 0;
    }
    const existingStudent = this.studentsData.get(id);
    if (existingStudent.roomId !== student.roomId) {
      const oldRoom = await this.getRoom(existingStudent.roomId);
      if (oldRoom) {
        oldRoom.occupied = Math.max(0, oldRoom.occupied - 1);
        if (oldRoom.occupied === 0) {
          oldRoom.status = "available";
        } else if (oldRoom.occupied < oldRoom.capacity) {
          oldRoom.status = "partially occupied";
        }
        this.roomsData.set(oldRoom.id, oldRoom);
      }
      const newRoom = await this.getRoom(student.roomId);
      if (newRoom) {
        newRoom.occupied += 1;
        if (newRoom.occupied >= newRoom.capacity) {
          newRoom.status = "full";
        } else {
          newRoom.status = "partially occupied";
        }
        this.roomsData.set(newRoom.id, newRoom);
      }
    }
    const updatedStudent = { ...existingStudent, ...student };
    this.studentsData.set(id, updatedStudent);
    return updatedStudent;
  }
  async deleteStudent(id) {
    if (!this.studentsData.has(id)) {
      return false;
    }
    const student = this.studentsData.get(id);
    const room = await this.getRoom(student.roomId);
    if (room) {
      room.occupied = Math.max(0, room.occupied - 1);
      if (room.occupied === 0) {
        room.status = "available";
      } else if (room.occupied < room.capacity) {
        room.status = "partially occupied";
      }
      this.roomsData.set(room.id, room);
    }
    return this.studentsData.delete(id);
  }
  // Attendance operations
  async getAttendanceByDate(date2, courseId) {
    const attendances2 = Array.from(this.attendancesData.values()).filter(
      (attendance) => attendance.date.toString() === date2
    );
    const studentIds = courseId ? Array.from(this.studentsData.values()).filter((student) => student.courseId === courseId).map((student) => student.id) : Array.from(this.studentsData.keys());
    return studentIds.map((studentId) => {
      const student = this.studentsData.get(studentId);
      const attendance = attendances2.find((a) => a.studentId === studentId);
      if (!student) return null;
      const course = this.coursesData.get(student.courseId);
      const room = this.roomsData.get(student.roomId);
      return {
        studentId,
        name: student.name,
        registrationNumber: student.registrationNumber,
        course: course?.name || "",
        roomNumber: room?.roomNumber || "",
        attendance: attendance?.status || null,
        notes: attendance?.notes || ""
      };
    }).filter(Boolean);
  }
  async createBulkAttendance(date2, attendanceRecords) {
    const results = [];
    for (const record of attendanceRecords) {
      const { studentId, status, notes } = record;
      const existingAttendance = Array.from(this.attendancesData.values()).find(
        (a) => a.studentId === studentId && a.date.toString() === date2
      );
      if (existingAttendance) {
        existingAttendance.status = status;
        existingAttendance.notes = notes || existingAttendance.notes;
        this.attendancesData.set(existingAttendance.id, existingAttendance);
        results.push(existingAttendance);
      } else {
        const id = this.attendanceId++;
        const newAttendance = {
          id,
          studentId,
          date: new Date(date2),
          status,
          notes: notes || ""
        };
        this.attendancesData.set(id, newAttendance);
        results.push(newAttendance);
      }
    }
    return results;
  }
  // Leave request operations
  async getAllLeaveRequests(status) {
    let requests = Array.from(this.leaveRequestsData.values());
    if (status) {
      requests = requests.filter((request) => request.status === status);
    }
    return requests.map((request) => {
      const student = this.studentsData.get(request.studentId);
      const course = student ? this.coursesData.get(student.courseId) : void 0;
      return {
        ...request,
        studentName: student?.name || "",
        registrationNumber: student?.registrationNumber || "",
        stream: course?.name || ""
      };
    });
  }
  async createLeaveRequest(leaveRequest) {
    const id = this.leaveRequestId++;
    const createdAt = /* @__PURE__ */ new Date();
    const newLeaveRequest = { ...leaveRequest, id, createdAt };
    this.leaveRequestsData.set(id, newLeaveRequest);
    return newLeaveRequest;
  }
  async updateLeaveRequestStatus(id, status, approvedBy) {
    if (!this.leaveRequestsData.has(id)) {
      return void 0;
    }
    const leaveRequest = this.leaveRequestsData.get(id);
    leaveRequest.status = status;
    leaveRequest.approvedBy = approvedBy;
    this.leaveRequestsData.set(id, leaveRequest);
    return leaveRequest;
  }
  // Complaint operations
  async getAllComplaints(status) {
    let complaints2 = Array.from(this.complaintsData.values());
    if (status) {
      complaints2 = complaints2.filter((complaint) => complaint.status === status);
    }
    return complaints2.map((complaint) => {
      const student = this.studentsData.get(complaint.studentId);
      const course = student ? this.coursesData.get(student.courseId) : void 0;
      return {
        ...complaint,
        name: student?.name || "",
        class: course?.name || "",
        contact: student?.contactNumber || "",
        email: student?.email || ""
      };
    });
  }
  async createComplaint(complaint) {
    const id = this.complaintId++;
    const newComplaint = { ...complaint, id };
    this.complaintsData.set(id, newComplaint);
    return newComplaint;
  }
  async updateComplaintStatus(id, status, assignedTo, notes, resolvedDate) {
    if (!this.complaintsData.has(id)) {
      return void 0;
    }
    const complaint = this.complaintsData.get(id);
    complaint.status = status;
    if (assignedTo !== void 0) {
      complaint.assignedTo = assignedTo;
    }
    if (notes) {
      complaint.notes = notes;
    }
    if (resolvedDate && (status === "resolved" || status === "closed")) {
      complaint.resolvedDate = new Date(resolvedDate);
    }
    this.complaintsData.set(id, complaint);
    return complaint;
  }
  // Access log operations
  async createAccessLog(log2) {
    const id = this.accessLogId++;
    const loginTime = log2.loginTime || /* @__PURE__ */ new Date();
    const newLog = {
      id,
      userId: log2.userId,
      ipAddress: log2.ipAddress || "",
      loginTime,
      logoutTime: log2.logoutTime || null,
      status: log2.status,
      userAgent: log2.userAgent || ""
    };
    this.accessLogsData.set(id, newLog);
    return newLog;
  }
  async updateAccessLogOnLogout(userId) {
    const activeLogs = Array.from(this.accessLogsData.values()).filter(
      (log2) => log2.userId === userId && log2.status === "active" && !log2.logoutTime
    );
    if (activeLogs.length === 0) {
      return false;
    }
    const now = /* @__PURE__ */ new Date();
    for (const log2 of activeLogs) {
      log2.logoutTime = now;
      log2.status = "success";
      this.accessLogsData.set(log2.id, log2);
    }
    return true;
  }
  async getAccessLogs(date2, userId) {
    let logs = Array.from(this.accessLogsData.values());
    if (date2) {
      const targetDate = new Date(date2);
      logs = logs.filter((log2) => {
        const logDate = new Date(log2.loginTime);
        return logDate.getFullYear() === targetDate.getFullYear() && logDate.getMonth() === targetDate.getMonth() && logDate.getDate() === targetDate.getDate();
      });
    }
    if (userId !== void 0) {
      logs = logs.filter((log2) => log2.userId === userId);
    }
    return logs.map((log2) => {
      const user = this.usersData.get(log2.userId);
      return {
        ...log2,
        userEmail: user?.email || "",
        username: user?.username || "",
        userType: user?.userType || ""
      };
    });
  }
  async clearAccessLogs() {
    this.accessLogsData.clear();
    this.accessLogId = 1;
  }
  // Dashboard statistics
  async getDashboardStats() {
    const totalStudents = this.studentsData.size;
    const totalRooms = this.roomsData.size;
    const totalCourses = this.coursesData.size;
    const floors = [1, 2, 3, 4];
    const floorStats = floors.map((floor) => {
      const roomsOnFloor = Array.from(this.roomsData.values()).filter(
        (room) => room.floor === floor
      );
      const totalRoomsOnFloor = roomsOnFloor.length;
      const occupiedRoomsOnFloor = roomsOnFloor.filter(
        (room) => room.occupied > 0
      ).length;
      const availableRoomsOnFloor = roomsOnFloor.filter(
        (room) => room.occupied < room.capacity
      ).length;
      return {
        floor: `Floor ${floor}`,
        rooms: totalRoomsOnFloor,
        occupied: occupiedRoomsOnFloor,
        available: availableRoomsOnFloor,
        occupancyRate: totalRoomsOnFloor > 0 ? Math.round(occupiedRoomsOnFloor / totalRoomsOnFloor * 100) : 0
      };
    });
    const now = /* @__PURE__ */ new Date();
    const recentActivity = [
      // Check for new students
      ...Array.from(this.studentsData.values()).filter((student) => {
        if (!student.joiningDate) return false;
        const joinDate = new Date(student.joiningDate);
        const diffDays = Math.floor((now.getTime() - joinDate.getTime()) / (1e3 * 60 * 60 * 24));
        return diffDays <= 7;
      }).map((student) => ({
        type: "student_registered",
        title: "New student registered",
        timestamp: student.joiningDate,
        details: `${student.name} (${student.registrationNumber})`
      })),
      // Check for leave requests
      ...Array.from(this.leaveRequestsData.values()).filter((request) => {
        const createdAt = new Date(request.createdAt);
        const diffDays = Math.floor((now.getTime() - createdAt.getTime()) / (1e3 * 60 * 60 * 24));
        return diffDays <= 7;
      }).map((request) => {
        const student = this.studentsData.get(request.studentId);
        return {
          type: `leave_request_${request.status.toLowerCase()}`,
          title: `Leave request ${request.status.toLowerCase()}`,
          timestamp: request.createdAt,
          details: `${student?.name || "Student"} (${student?.registrationNumber || ""})`
        };
      }),
      // Check for new complaints
      ...Array.from(this.complaintsData.values()).filter((complaint) => {
        const issueDate = new Date(complaint.issueDate);
        const diffDays = Math.floor((now.getTime() - issueDate.getTime()) / (1e3 * 60 * 60 * 24));
        return diffDays <= 7;
      }).map((complaint) => {
        const student = this.studentsData.get(complaint.studentId);
        return {
          type: "new_complaint",
          title: "New complaint submitted",
          timestamp: complaint.issueDate,
          details: `${complaint.topic} by ${student?.name || "Student"}`
        };
      })
    ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 5);
    const courseWiseDistribution = Array.from(this.coursesData.values()).map((course) => {
      const studentsInCourse = Array.from(this.studentsData.values()).filter(
        (student) => student.courseId === course.id
      ).length;
      return {
        name: course.name,
        students: studentsInCourse
      };
    });
    return {
      totalStudents,
      totalRooms,
      totalCourses,
      floorStats,
      recentActivity,
      courseWiseDistribution
    };
  }
};
var storage = new MemStorage();

// shared/schema.ts
import { pgTable, text, serial, integer, boolean, timestamp, date } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
var users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email"),
  userType: text("user_type").default("admin"),
  createdAt: timestamp("created_at").defaultNow()
});
var insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  userType: true
});
var courses = pgTable("courses", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  code: text("code").notNull().unique(),
  duration: integer("duration").notNull(),
  // in years
  description: text("description"),
  status: text("status").default("active")
});
var insertCourseSchema = createInsertSchema(courses).pick({
  name: true,
  code: true,
  duration: true,
  description: true,
  status: true
});
var rooms = pgTable("rooms", {
  id: serial("id").primaryKey(),
  roomNumber: text("room_number").notNull().unique(),
  floor: integer("floor").notNull(),
  type: text("type").notNull(),
  // e.g., "3-seater"
  capacity: integer("capacity").notNull(),
  occupied: integer("occupied").default(0),
  status: text("status").default("available"),
  description: text("description"),
  wifi: boolean("wifi").default(false),
  ac: boolean("ac").default(false),
  attachedToilet: boolean("attached_toilet").default(false),
  balcony: boolean("balcony").default(false)
});
var insertRoomSchema = createInsertSchema(rooms).pick({
  roomNumber: true,
  floor: true,
  type: true,
  capacity: true,
  occupied: true,
  status: true,
  description: true,
  wifi: true,
  ac: true,
  attachedToilet: true,
  balcony: true
});
var students = pgTable("students", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  registrationNumber: text("registration_number").notNull().unique(),
  courseId: integer("course_id").notNull(),
  roomId: integer("room_id").notNull(),
  email: text("email"),
  contactNumber: text("contact_number"),
  year: integer("year"),
  // Current year of study
  joiningDate: date("joining_date"),
  address: text("address"),
  guardianName: text("guardian_name"),
  guardianContact: text("guardian_contact"),
  status: text("status").default("active")
});
var insertStudentSchema = createInsertSchema(students).pick({
  name: true,
  registrationNumber: true,
  courseId: true,
  roomId: true,
  email: true,
  contactNumber: true,
  year: true,
  joiningDate: true,
  address: true,
  guardianName: true,
  guardianContact: true,
  status: true
});
var attendances = pgTable("attendances", {
  id: serial("id").primaryKey(),
  studentId: integer("student_id").notNull(),
  date: date("date").notNull(),
  status: text("status").notNull(),
  // "present" or "absent"
  notes: text("notes")
});
var insertAttendanceSchema = createInsertSchema(attendances).pick({
  studentId: true,
  date: true,
  status: true,
  notes: true
});
var leaveRequests = pgTable("leave_requests", {
  id: serial("id").primaryKey(),
  studentId: integer("student_id").notNull(),
  permissionType: text("permission_type").notNull(),
  reason: text("reason").notNull(),
  leaveDate: timestamp("leave_date").notNull(),
  returnDate: timestamp("return_date").notNull(),
  placeOfVisit: text("place_of_visit"),
  contactNumber: text("contact_number"),
  status: text("status").default("pending"),
  // "pending", "approved", "rejected"
  approvedBy: integer("approved_by"),
  // User ID who approved/rejected
  createdAt: timestamp("created_at").defaultNow()
});
var insertLeaveRequestSchema = createInsertSchema(leaveRequests).pick({
  studentId: true,
  permissionType: true,
  reason: true,
  leaveDate: true,
  returnDate: true,
  placeOfVisit: true,
  contactNumber: true,
  status: true
});
var complaints = pgTable("complaints", {
  id: serial("id").primaryKey(),
  studentId: integer("student_id").notNull(),
  topic: text("topic").notNull(),
  description: text("description").notNull(),
  issueDate: date("issue_date").defaultNow(),
  status: text("status").default("new"),
  // "new", "in progress", "resolved", "closed"
  assignedTo: integer("assigned_to"),
  // User ID of staff assigned to handle
  resolvedDate: date("resolved_date"),
  notes: text("notes")
});
var insertComplaintSchema = createInsertSchema(complaints).pick({
  studentId: true,
  topic: true,
  description: true,
  issueDate: true,
  status: true,
  assignedTo: true,
  resolvedDate: true,
  notes: true
});
var accessLogs = pgTable("access_logs", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  ipAddress: text("ip_address"),
  loginTime: timestamp("login_time").defaultNow(),
  logoutTime: timestamp("logout_time"),
  status: text("status").notNull(),
  // "success", "failed", "active"
  userAgent: text("user_agent")
});
var insertAccessLogSchema = createInsertSchema(accessLogs).pick({
  userId: true,
  ipAddress: true,
  loginTime: true,
  logoutTime: true,
  status: true,
  userAgent: true
});

// server/routes.ts
import { z } from "zod";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
var handleValidationError = (err, res) => {
  if (err instanceof ZodError) {
    const validationError = fromZodError(err);
    return res.status(400).json({ message: validationError.message });
  }
  return res.status(500).json({ message: "Internal server error" });
};
async function registerRoutes(app2) {
  const httpServer = createServer(app2);
  app2.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
      }
      const user = await storage.getUserByUsername(username);
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      await storage.createAccessLog({
        userId: user.id,
        ipAddress: req.ip || "",
        status: "success",
        userAgent: req.headers["user-agent"] || ""
      });
      return res.status(200).json({
        message: "Login successful",
        user: { id: user.id, username: user.username, userType: user.userType }
      });
    } catch (error) {
      console.error("Login error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  app2.post("/api/auth/logout", async (req, res) => {
    try {
      const { userId } = req.body;
      if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
      }
      await storage.updateAccessLogOnLogout(userId);
      return res.status(200).json({ message: "Logout successful" });
    } catch (error) {
      console.error("Logout error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  app2.post("/api/auth/change-password", async (req, res) => {
    try {
      const { userId, currentPassword, newPassword } = req.body;
      if (!userId || !currentPassword || !newPassword) {
        return res.status(400).json({ message: "User ID, current password, and new password are required" });
      }
      const result = await storage.changePassword(userId, currentPassword, newPassword);
      if (!result) {
        return res.status(400).json({ message: "Current password is incorrect" });
      }
      return res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
      console.error("Change password error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  app2.get("/api/courses", async (req, res) => {
    try {
      const courses2 = await storage.getAllCourses();
      return res.status(200).json(courses2);
    } catch (error) {
      console.error("Get courses error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  app2.post("/api/courses", async (req, res) => {
    try {
      const courseData = insertCourseSchema.parse(req.body);
      const course = await storage.createCourse(courseData);
      return res.status(201).json(course);
    } catch (error) {
      return handleValidationError(error, res);
    }
  });
  app2.get("/api/courses/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const course = await storage.getCourse(id);
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }
      return res.status(200).json(course);
    } catch (error) {
      console.error("Get course error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  app2.put("/api/courses/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const courseData = insertCourseSchema.parse(req.body);
      const updated = await storage.updateCourse(id, courseData);
      if (!updated) {
        return res.status(404).json({ message: "Course not found" });
      }
      return res.status(200).json(updated);
    } catch (error) {
      return handleValidationError(error, res);
    }
  });
  app2.delete("/api/courses/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteCourse(id);
      if (!deleted) {
        return res.status(404).json({ message: "Course not found" });
      }
      return res.status(200).json({ message: "Course deleted successfully" });
    } catch (error) {
      console.error("Delete course error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  app2.get("/api/rooms", async (req, res) => {
    try {
      const floor = req.query.floor ? parseInt(req.query.floor) : void 0;
      const status = req.query.status;
      const rooms2 = await storage.getAllRooms(floor, status);
      return res.status(200).json(rooms2);
    } catch (error) {
      console.error("Get rooms error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  app2.post("/api/rooms", async (req, res) => {
    try {
      const roomData = insertRoomSchema.parse(req.body);
      const room = await storage.createRoom(roomData);
      return res.status(201).json(room);
    } catch (error) {
      return handleValidationError(error, res);
    }
  });
  app2.get("/api/rooms/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const room = await storage.getRoom(id);
      if (!room) {
        return res.status(404).json({ message: "Room not found" });
      }
      return res.status(200).json(room);
    } catch (error) {
      console.error("Get room error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  app2.put("/api/rooms/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const roomData = insertRoomSchema.parse(req.body);
      const updated = await storage.updateRoom(id, roomData);
      if (!updated) {
        return res.status(404).json({ message: "Room not found" });
      }
      return res.status(200).json(updated);
    } catch (error) {
      return handleValidationError(error, res);
    }
  });
  app2.get("/api/students", async (req, res) => {
    try {
      const courseId = req.query.courseId ? parseInt(req.query.courseId) : void 0;
      const roomId = req.query.roomId ? parseInt(req.query.roomId) : void 0;
      const students2 = await storage.getAllStudents(courseId, roomId);
      return res.status(200).json(students2);
    } catch (error) {
      console.error("Get students error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  app2.post("/api/students", async (req, res) => {
    try {
      const studentData = insertStudentSchema.parse(req.body);
      const student = await storage.createStudent(studentData);
      return res.status(201).json(student);
    } catch (error) {
      return handleValidationError(error, res);
    }
  });
  app2.get("/api/students/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const student = await storage.getStudent(id);
      if (!student) {
        return res.status(404).json({ message: "Student not found" });
      }
      return res.status(200).json(student);
    } catch (error) {
      console.error("Get student error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  app2.put("/api/students/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const studentData = insertStudentSchema.parse(req.body);
      const updated = await storage.updateStudent(id, studentData);
      if (!updated) {
        return res.status(404).json({ message: "Student not found" });
      }
      return res.status(200).json(updated);
    } catch (error) {
      return handleValidationError(error, res);
    }
  });
  app2.delete("/api/students/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteStudent(id);
      if (!deleted) {
        return res.status(404).json({ message: "Student not found" });
      }
      return res.status(200).json({ message: "Student deleted successfully" });
    } catch (error) {
      console.error("Delete student error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  app2.get("/api/attendance", async (req, res) => {
    try {
      const date2 = req.query.date;
      const courseId = req.query.courseId ? parseInt(req.query.courseId) : void 0;
      if (!date2) {
        return res.status(400).json({ message: "Date parameter is required" });
      }
      const attendance = await storage.getAttendanceByDate(date2, courseId);
      return res.status(200).json(attendance);
    } catch (error) {
      console.error("Get attendance error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  app2.post("/api/attendance", async (req, res) => {
    try {
      const { date: date2, attendanceRecords } = req.body;
      if (!date2 || !attendanceRecords || !Array.isArray(attendanceRecords)) {
        return res.status(400).json({ message: "Date and attendance records array are required" });
      }
      const schema = z.array(z.object({
        studentId: z.number(),
        status: z.enum(["present", "absent"]),
        notes: z.string().optional()
      }));
      const validatedRecords = schema.parse(attendanceRecords);
      const results = await storage.createBulkAttendance(date2, validatedRecords);
      return res.status(201).json({ message: "Attendance recorded successfully", results });
    } catch (error) {
      return handleValidationError(error, res);
    }
  });
  app2.get("/api/leave-requests", async (req, res) => {
    try {
      const status = req.query.status;
      const leaveRequests2 = await storage.getAllLeaveRequests(status);
      return res.status(200).json(leaveRequests2);
    } catch (error) {
      console.error("Get leave requests error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  app2.post("/api/leave-requests", async (req, res) => {
    try {
      const leaveRequestData = insertLeaveRequestSchema.parse(req.body);
      const leaveRequest = await storage.createLeaveRequest(leaveRequestData);
      return res.status(201).json(leaveRequest);
    } catch (error) {
      return handleValidationError(error, res);
    }
  });
  app2.put("/api/leave-requests/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { status, approvedBy } = req.body;
      if (!status || !["approved", "rejected"].includes(status)) {
        return res.status(400).json({ message: "Valid status is required" });
      }
      if (!approvedBy) {
        return res.status(400).json({ message: "Approved by user ID is required" });
      }
      const updated = await storage.updateLeaveRequestStatus(id, status, approvedBy);
      if (!updated) {
        return res.status(404).json({ message: "Leave request not found" });
      }
      return res.status(200).json(updated);
    } catch (error) {
      console.error("Update leave request error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  app2.get("/api/complaints", async (req, res) => {
    try {
      const status = req.query.status;
      const complaints2 = await storage.getAllComplaints(status);
      return res.status(200).json(complaints2);
    } catch (error) {
      console.error("Get complaints error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  app2.post("/api/complaints", async (req, res) => {
    try {
      const complaintData = insertComplaintSchema.parse(req.body);
      const complaint = await storage.createComplaint(complaintData);
      return res.status(201).json(complaint);
    } catch (error) {
      return handleValidationError(error, res);
    }
  });
  app2.put("/api/complaints/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { status, assignedTo, notes, resolvedDate } = req.body;
      if (!status) {
        return res.status(400).json({ message: "Status is required" });
      }
      const updated = await storage.updateComplaintStatus(id, status, assignedTo, notes, resolvedDate);
      if (!updated) {
        return res.status(404).json({ message: "Complaint not found" });
      }
      return res.status(200).json(updated);
    } catch (error) {
      console.error("Update complaint error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  app2.get("/api/access-logs", async (req, res) => {
    try {
      const date2 = req.query.date;
      const userId = req.query.userId ? parseInt(req.query.userId) : void 0;
      const logs = await storage.getAccessLogs(date2, userId);
      return res.status(200).json(logs);
    } catch (error) {
      console.error("Get access logs error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  app2.delete("/api/access-logs", async (req, res) => {
    try {
      await storage.clearAccessLogs();
      return res.status(200).json({ message: "Access logs cleared successfully" });
    } catch (error) {
      console.error("Clear access logs error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  app2.get("/api/dashboard/stats", async (req, res) => {
    try {
      const stats = await storage.getDashboardStats();
      return res.status(200).json(stats);
    } catch (error) {
      console.error("Get dashboard stats error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  base: "/hosteldashboard/",
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist"),
    emptyOutDir: true
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = 5e3;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
  });
})();
