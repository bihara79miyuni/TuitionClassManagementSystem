package TCMS.com.tcms.repo;

import org.springframework.data.jpa.repository.JpaRepository;

import TCMS.com.tcms.model.Enrollment;

public interface EnrollmentRepo extends JpaRepository<Enrollment, Integer> {}
