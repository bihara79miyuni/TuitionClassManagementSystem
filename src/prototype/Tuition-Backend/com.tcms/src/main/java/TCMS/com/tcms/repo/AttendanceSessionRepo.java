package TCMS.com.tcms.repo;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import TCMS.com.tcms.model.AttendanceSession;

public interface AttendanceSessionRepo extends JpaRepository<AttendanceSession, Integer> {
  Optional<AttendanceSession> findByClazz_ClassIdAndSessionDate(Integer classId, java.time.LocalDate date);
}
