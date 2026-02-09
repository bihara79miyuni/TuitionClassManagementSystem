package TCMS.com.tcms.model;
import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name="attendance_session")
public class AttendanceSession {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY)
  @Column(name="session_id")
  private Integer sessionId;

  @ManyToOne(optional=false) @JoinColumn(name="class_id")
  private ClassEntity clazz;

  @Column(name="session_date", nullable=false)
  private LocalDate sessionDate;

  @Column(name="start_time")
  private String startTime;

  @Column(name="end_time")
  private String endTime;

  // getters/setters
  public Integer getSessionId(){ return sessionId; }
  public void setSessionId(Integer v){ sessionId=v; }
  public ClassEntity getClazz(){ return clazz; }
  public void setClazz(ClassEntity v){ clazz=v; }
  public LocalDate getSessionDate(){ return sessionDate; }
  public void setSessionDate(LocalDate v){ sessionDate=v; }
  public String getStartTime(){ return startTime; }
  public void setStartTime(String v){ startTime=v; }
  public String getEndTime(){ return endTime; }
  public void setEndTime(String v){ endTime=v; }
}
