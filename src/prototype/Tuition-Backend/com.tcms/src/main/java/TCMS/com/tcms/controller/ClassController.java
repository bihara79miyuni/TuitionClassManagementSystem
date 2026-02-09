package TCMS.com.tcms.controller;

import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import TCMS.com.tcms.model.ClassEntity;
import TCMS.com.tcms.repo.ClassRepo;
import TCMS.com.tcms.repo.TeacherRepo;

@RestController
@RequestMapping("/api/classes")
@CrossOrigin
public class ClassController {
    private final ClassRepo classRepo;
  private final TeacherRepo teacherRepo;

  public ClassController(ClassRepo c, TeacherRepo t){ this.classRepo=c; this.teacherRepo=t; }

  @GetMapping
  public List<ClassEntity> all(){ return classRepo.findAll(); }

  @PostMapping
  public ClassEntity create(@RequestBody Map<String,Object> body){
    ClassEntity c = new ClassEntity();
    c.setClassName((String) body.get("className"));
    c.setSubject((String) body.get("subject"));
    c.setGrade((String) body.get("grade"));
    c.setScheduleDay((String) body.get("scheduleDay"));
    c.setScheduleTime((String) body.get("scheduleTime"));
    c.setMonthlyFee(Double.valueOf(body.get("monthlyFee").toString()));

    Integer teacherId = Integer.valueOf(body.get("teacherId").toString());
    c.setTeacher(teacherRepo.findById(teacherId).orElseThrow());

    return classRepo.save(c);
  }

  @PutMapping("/{id}")
  public ClassEntity update(@PathVariable Integer id, @RequestBody Map<String,Object> body){
    var c = classRepo.findById(id).orElseThrow();
    if(body.containsKey("className")) c.setClassName((String) body.get("className"));
    if(body.containsKey("subject")) c.setSubject((String) body.get("subject"));
    if(body.containsKey("grade")) c.setGrade((String) body.get("grade"));
    if(body.containsKey("scheduleDay")) c.setScheduleDay((String) body.get("scheduleDay"));
    if(body.containsKey("scheduleTime")) c.setScheduleTime((String) body.get("scheduleTime"));
    if(body.containsKey("monthlyFee")) c.setMonthlyFee(Double.valueOf(body.get("monthlyFee").toString()));
    if(body.containsKey("teacherId")) {
      Integer teacherId = Integer.valueOf(body.get("teacherId").toString());
      c.setTeacher(teacherRepo.findById(teacherId).orElseThrow());
    }
    return classRepo.save(c);
  }

  @DeleteMapping("/{id}")
  public void delete(@PathVariable Integer id){ classRepo.deleteById(id); }
}

