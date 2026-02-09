package TCMS.com.tcms.model;

import jakarta.persistence.*;
@Entity
@Table(name="teacher")
public class Teacher {


  @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name="teacher_id")
  private Integer teacherId;

  @Column(name="full_name", nullable=false)
  private String fullName;

  private String phone;
  private String email;
  private String subject;

  @Column(nullable=false, unique=true)
  private String username;

  @Column(name="password_hash", nullable=false)
  private String passwordHash;

  // getters/setters
  public Integer getTeacherId(){ return teacherId; }
  public void setTeacherId(Integer v){ teacherId=v; }
  public String getFullName(){ return fullName; }
  public void setFullName(String v){ fullName=v; }
  public String getPhone(){ return phone; }
  public void setPhone(String v){ phone=v; }
  public String getEmail(){ return email; }
  public void setEmail(String v){ email=v; }
  public String getSubject(){ return subject; }
  public void setSubject(String v){ subject=v; }
  public String getUsername(){ return username; }
  public void setUsername(String v){ username=v; }
  public String getPasswordHash(){ return passwordHash; }
  public void setPasswordHash(String v){ passwordHash=v; }
}
    

