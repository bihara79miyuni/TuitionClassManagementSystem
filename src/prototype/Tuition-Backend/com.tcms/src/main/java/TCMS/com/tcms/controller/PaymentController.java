package TCMS.com.tcms.controller;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import TCMS.com.tcms.model.Payment;
import TCMS.com.tcms.repo.ClassRepo;
import TCMS.com.tcms.repo.PaymentRepo;
import TCMS.com.tcms.repo.StudentRepo;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin
public class PaymentController {
    private final PaymentRepo paymentRepo;
  private final StudentRepo studentRepo;
  private final ClassRepo classRepo;

  public PaymentController(PaymentRepo p, StudentRepo s, ClassRepo c){
    this.paymentRepo=p; this.studentRepo=s; this.classRepo=c;
  }

  @GetMapping
  public List<Payment> all(@RequestParam(required=false) String status){
    var list = paymentRepo.findAll();
    if(status == null || status.isBlank()) return list;
    return list.stream().filter(x -> x.getPayStatus().name().equalsIgnoreCase(status)).toList();
  }

  @PostMapping
  public Payment upsert(@RequestBody Map<String,Object> body){
    Integer studentId = Integer.valueOf(body.get("studentId").toString());
    Integer classId = Integer.valueOf(body.get("classId").toString());

    Payment p = new Payment();
    p.setStudent(studentRepo.findById(studentId).orElseThrow());
    p.setClazz(classRepo.findById(classId).orElseThrow());
    p.setMonth(body.get("month").toString()); // 2026-02
    p.setAmount(Double.valueOf(body.get("amount").toString()));
    p.setMethod(Payment.Method.valueOf(body.getOrDefault("method","CASH").toString()));
    p.setPayStatus(Payment.PayStatus.valueOf(body.getOrDefault("payStatus","PENDING").toString()));
    if(body.get("paidDate") != null) p.setPaidDate(LocalDate.parse(body.get("paidDate").toString()));
    p.setReceiptNo((String) body.getOrDefault("receiptNo", null));
    return paymentRepo.save(p);
  }
}
