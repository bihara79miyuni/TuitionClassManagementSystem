package TCMS.com.tcms.repo;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import TCMS.com.tcms.model.Teacher;

public interface TeacherRepo extends JpaRepository<Teacher, Integer> {
  Optional<Teacher> findByUsername(String username);
}
