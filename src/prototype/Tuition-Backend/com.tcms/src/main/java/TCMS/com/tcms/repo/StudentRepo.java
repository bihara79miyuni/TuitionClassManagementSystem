package TCMS.com.tcms.repo;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import TCMS.com.tcms.model.Student;

public interface StudentRepo extends JpaRepository<Student, Integer> {
  Optional<Student> findByUsername(String username);
}
