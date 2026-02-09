package TCMS.com.tcms.repo;

import org.springframework.data.jpa.repository.JpaRepository;

import TCMS.com.tcms.model.Payment;

public interface PaymentRepo extends JpaRepository<Payment, Integer> {}