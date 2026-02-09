package TCMS.com.tcms.model;

import java.time.LocalDate;
import jakarta.persistence.*;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
@Table(name="student")
public class Student {
     @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name="student_id")
  private Integer studentId;

  @Column(name="full_name", nullable=false)
  private String fullName;

  private String phone;
  private String email;
  private String address;

  @Column(name="registered_date", nullable=false)
  private LocalDate registeredDate = LocalDate.now();

  @Column(nullable=false)
  private String status = "ACTIVE";

  @Column(nullable=false, unique=true)
  private String username;

  @Column(name="password_hash", nullable=false)
  private String passwordHash;

  // getters/setters
  public Integer getStudentId(){ return studentId; }
  public void setStudentId(Integer v){ studentId=v; }
  public String getFullName(){ return fullName; }
  public void setFullName(String v){ fullName=v; }
  public String getPhone(){ return phone; }
  public void setPhone(String v){ phone=v; }
  public String getEmail(){ return email; }
  public void setEmail(String v){ email=v; }
  public String getAddress(){ return address; }
  public void setAddress(String v){ address=v; }
  public LocalDate getRegisteredDate(){ return registeredDate; }
  public void setRegisteredDate(LocalDate v){ registeredDate=v; }
  public String getStatus(){ return status; }
  public void setStatus(String v){ status=v; }
  public String getUsername(){ return username; }
  public void setUsername(String v){ username=v; }
  public String getPasswordHash(){ return passwordHash; }
  public void setPasswordHash(String v){ passwordHash=v; }
}

