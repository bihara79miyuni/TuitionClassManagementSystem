package TCMS.com.tcms.model;
import jakarta.persistence.*;

@Entity
@Table(name="attendance")
public class Attendance {
     @Id @GeneratedValue(strategy=GenerationType.IDENTITY)
  @Column(name="attendance_id")
  private Integer attendanceId;

  @ManyToOne(optional=false) @JoinColumn(name="session_id")
  private AttendanceSession session;

  @ManyToOne(optional=false) @JoinColumn(name="student_id")
  private Student student;

  @Enumerated(EnumType.STRING)
  @Column(nullable=false)
  private Status status;

  private String note;

  public enum Status { PRESENT, ABSENT }

  // getters/setters
  public Integer getAttendanceId(){ return attendanceId; }
  public void setAttendanceId(Integer v){ attendanceId=v; }
  public AttendanceSession getSession(){ return session; }
  public void setSession(AttendanceSession v){ session=v; }
  public Student getStudent(){ return student; }
  public void setStudent(Student v){ student=v; }
  public Status getStatus(){ return status; }
  public void setStatus(Status v){ status=v; }
  public String getNote(){ return note; }
  public void setNote(String v){ note=v; }
}
