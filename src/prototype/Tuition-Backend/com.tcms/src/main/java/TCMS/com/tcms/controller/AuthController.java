package TCMS.com.tcms.controller;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import TCMS.com.tcms.model.Student;
import TCMS.com.tcms.model.Teacher;
import TCMS.com.tcms.repo.StudentRepo;
import TCMS.com.tcms.repo.TeacherRepo;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin
public class AuthController {
    private final StudentRepo studentRepo;
    private final TeacherRepo teacherRepo;
    private final PasswordEncoder encoder;

    public AuthController(StudentRepo s, TeacherRepo t, PasswordEncoder e){
    this.studentRepo = s; this.teacherRepo=t; this.encoder=e;
    }

  @PostMapping("/student/register")
  public Student studentRegister(@RequestBody Student s){
    s.setPasswordHash(encoder.encode(s.getPasswordHash())); // send raw password in passwordHash field
    return studentRepo.save(s);
  }

  @PostMapping("/student/login")
  public Map<String,Object> studentLogin(@RequestBody Map<String,String> body){
    var u = studentRepo.findByUsername(body.get("username"))
      .orElseThrow(() -> new RuntimeException("Invalid login"));
    if(!encoder.matches(body.get("password"), u.getPasswordHash()))
      throw new RuntimeException("Invalid login");
    return Map.of("role","student","student_id",u.getStudentId(),"username",u.getUsername(),"full_name",u.getFullName());
  }

  @PostMapping("/teacher/register")
  public Teacher teacherRegister(@RequestBody Teacher t){
    t.setPasswordHash(encoder.encode(t.getPasswordHash()));
    return teacherRepo.save(t);
  }

  @PostMapping("/teacher/login")
  public Map<String,Object> teacherLogin(@RequestBody Map<String,String> body){
    var u = teacherRepo.findByUsername(body.get("username"))
      .orElseThrow(() -> new RuntimeException("Invalid login"));
    if(!encoder.matches(body.get("password"), u.getPasswordHash()))
      throw new RuntimeException("Invalid login");
    return Map.of("role","teacher","teacher_id",u.getTeacherId(),"username",u.getUsername(),"full_name",u.getFullName());
  }
}
