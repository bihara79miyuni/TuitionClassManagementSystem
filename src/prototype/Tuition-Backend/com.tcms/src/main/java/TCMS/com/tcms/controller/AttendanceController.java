package TCMS.com.tcms.controller;

import java.time.LocalDate;
import java.util.Map;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import TCMS.com.tcms.model.Attendance;
import TCMS.com.tcms.model.AttendanceSession;
import TCMS.com.tcms.repo.AttendanceRepo;
import TCMS.com.tcms.repo.AttendanceSessionRepo;
import TCMS.com.tcms.repo.ClassRepo;
import TCMS.com.tcms.repo.StudentRepo;

@RestController
@RequestMapping("/api/attendance")
@CrossOrigin
public class AttendanceController {
    private final AttendanceSessionRepo sessionRepo;
  private final AttendanceRepo attendanceRepo;
  private final ClassRepo classRepo;
  private final StudentRepo studentRepo;

  public AttendanceController(AttendanceSessionRepo sr, AttendanceRepo ar, ClassRepo cr, StudentRepo str){
    this.sessionRepo=sr; this.attendanceRepo=ar; this.classRepo=cr; this.studentRepo=str;
  }

  @GetMapping("/sessions")
  public AttendanceSession getOrNull(@RequestParam Integer classId, @RequestParam String date){
    LocalDate d = LocalDate.parse(date);
    return sessionRepo.findByClazz_ClassIdAndSessionDate(classId, d).orElse(null);
  }

  @PostMapping("/sessions")
  public AttendanceSession createSession(@RequestBody Map<String,Object> body){
    Integer classId = Integer.valueOf(body.get("classId").toString());
    LocalDate d = LocalDate.parse(body.get("sessionDate").toString());

    AttendanceSession s = new AttendanceSession();
    s.setClazz(classRepo.findById(classId).orElseThrow());
    s.setSessionDate(d);
    s.setStartTime((String) body.getOrDefault("startTime", null));
    s.setEndTime((String) body.getOrDefault("endTime", null));
    return sessionRepo.save(s);
  }

  @PostMapping("/mark")
  public Attendance mark(@RequestBody Map<String,Object> body){
    Integer sessionId = Integer.valueOf(body.get("sessionId").toString());
    Integer studentId = Integer.valueOf(body.get("studentId").toString());
    String status = body.get("status").toString(); // PRESENT/ABSENT

    Attendance a = new Attendance();
    a.setSession(sessionRepo.findById(sessionId).orElseThrow());
    a.setStudent(studentRepo.findById(studentId).orElseThrow());
    a.setStatus(Attendance.Status.valueOf(status));
    a.setNote((String) body.getOrDefault("note", null));
    return attendanceRepo.save(a);
  }
}
