package TCMS.com.tcms.model;
import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name="enrollment")
public class Enrollment {
     @Id @GeneratedValue(strategy=GenerationType.IDENTITY)
  @Column(name="enrollment_id")
  private Integer enrollmentId;

  @ManyToOne(optional=false) @JoinColumn(name="student_id")
  private Student student;

  @ManyToOne(optional=false) @JoinColumn(name="class_id")
  private ClassEntity clazz;

  @Column(name="enrolled_date", nullable=false)
  private LocalDate enrolledDate = LocalDate.now();

  @Column(name="enroll_status", nullable=false)
  private String enrollStatus = "ACTIVE";

  // getters/setters
  public Integer getEnrollmentId(){ return enrollmentId; }
  public void setEnrollmentId(Integer v){ enrollmentId=v; }
  public Student getStudent(){ return student; }
  public void setStudent(Student v){ student=v; }
  public ClassEntity getClazz(){ return clazz; }
  public void setClazz(ClassEntity v){ clazz=v; }
  public LocalDate getEnrolledDate(){ return enrolledDate; }
  public void setEnrolledDate(LocalDate v){ enrolledDate=v; }
  public String getEnrollStatus(){ return enrollStatus; }
  public void setEnrollStatus(String v){ enrollStatus=v; }
}
