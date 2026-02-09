package TCMS.com.tcms.model;

import jakarta.persistence.*;

@Entity
@Table(name="class")
public class ClassEntity {
     @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name="class_id")
  private Integer classId;

  @Column(name="class_name", nullable=false)
  private String className;

  private String subject;
  private String grade;

  @Column(name="schedule_day")
  private String scheduleDay;

  @Column(name="schedule_time")
  private String scheduleTime;

  @Column(name="monthly_fee", nullable=false)
  private Double monthlyFee;

  @ManyToOne(optional=false)
  @JoinColumn(name="teacher_id")
  private Teacher teacher;

  // getters/setters
  public Integer getClassId(){ return classId; }
  public void setClassId(Integer v){ classId=v; }
  public String getClassName(){ return className; }
  public void setClassName(String v){ className=v; }
  public String getSubject(){ return subject; }
  public void setSubject(String v){ subject=v; }
  public String getGrade(){ return grade; }
  public void setGrade(String v){ grade=v; }
  public String getScheduleDay(){ return scheduleDay; }
  public void setScheduleDay(String v){ scheduleDay=v; }
  public String getScheduleTime(){ return scheduleTime; }
  public void setScheduleTime(String v){ scheduleTime=v; }
  public Double getMonthlyFee(){ return monthlyFee; }
  public void setMonthlyFee(Double v){ monthlyFee=v; }
  public Teacher getTeacher(){ return teacher; }
  public void setTeacher(Teacher v){ teacher=v; }
}
