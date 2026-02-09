package TCMS.com.tcms.model;
import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name="payment")
public class Payment {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY)
  @Column(name="payment_id")
  private Integer paymentId;

  @ManyToOne(optional=false) @JoinColumn(name="student_id")
  private Student student;

  @ManyToOne(optional=false) @JoinColumn(name="class_id")
  private ClassEntity clazz;

  @Column(nullable=false) private String month;
  @Column(nullable=false) private Double amount;

  @Column(name="paid_date") private LocalDate paidDate;

  @Enumerated(EnumType.STRING)
  @Column(nullable=false)
  private Method method = Method.CASH;

  @Enumerated(EnumType.STRING)
  @Column(name="pay_status", nullable=false)
  private PayStatus payStatus = PayStatus.PENDING;

  @Column(name="receipt_no") private String receiptNo;

  public enum Method { CASH, CARD, ONLINE }
  public enum PayStatus { PAID, PENDING }

  // getters/setters
  public Integer getPaymentId(){ return paymentId; }
  public void setPaymentId(Integer v){ paymentId=v; }
  public Student getStudent(){ return student; }
  public void setStudent(Student v){ student=v; }
  public ClassEntity getClazz(){ return clazz; }
  public void setClazz(ClassEntity v){ clazz=v; }
  public String getMonth(){ return month; }
  public void setMonth(String v){ month=v; }
  public Double getAmount(){ return amount; }
  public void setAmount(Double v){ amount=v; }
  public LocalDate getPaidDate(){ return paidDate; }
  public void setPaidDate(LocalDate v){ paidDate=v; }
  public Method getMethod(){ return method; }
  public void setMethod(Method v){ method=v; }
  public PayStatus getPayStatus(){ return payStatus; }
  public void setPayStatus(PayStatus v){ payStatus=v; }
  public String getReceiptNo(){ return receiptNo; }
  public void setReceiptNo(String v){ receiptNo=v; }
}
