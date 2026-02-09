package TCMS.com.tcms.controller;

import java.util.Map;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import TCMS.com.tcms.model.Enrollment;
import TCMS.com.tcms.repo.ClassRepo;
import TCMS.com.tcms.repo.EnrollmentRepo;
import TCMS.com.tcms.repo.StudentRepo;

@RestController
@RequestMapping("/api/enrollments")
@CrossOrigin
public class EnrollmentController {
    private final EnrollmentRepo enrollmentRepo;
  private final StudentRepo studentRepo;
  private final ClassRepo classRepo;

  public EnrollmentController(EnrollmentRepo e, StudentRepo s, ClassRepo c){
    this.enrollmentRepo=e; this.studentRepo=s; this.classRepo=c;
  }

  @PostMapping
  public Enrollment enroll(@RequestBody Map<String,Object> body){
    Integer studentId = Integer.valueOf(body.get("studentId").toString());
    Integer classId = Integer.valueOf(body.get("classId").toString());

    Enrollment en = new Enrollment();
    en.setStudent(studentRepo.findById(studentId).orElseThrow());
    en.setClazz(classRepo.findById(classId).orElseThrow());
    en.setEnrollStatus(body.getOrDefault("enrollStatus","ACTIVE").toString());
    return enrollmentRepo.save(en);
  }
}
