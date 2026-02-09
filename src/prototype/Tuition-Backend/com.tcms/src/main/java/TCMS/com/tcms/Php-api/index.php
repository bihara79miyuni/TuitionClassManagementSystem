<?php
require_once "config.php";
require_once "helpers.php";

$method = $_SERVER["REQUEST_METHOD"];
$path = parse_url($_SERVER["REQUEST_URI"], PHP_URL_PATH);

// If your API is in /php-api/ then remove prefix
// Example: /php-api/index.php/api/classes
$path = preg_replace('#.*/index\.php#', '', $path);

if ($path === "") $path = "/";

$body = json_input();

// -------- AUTH STUDENT REGISTER ----------
if ($method === "POST" && $path === "/api/auth/student/register") {
  $full_name = $body["full_name"] ?? "";
  $username  = $body["username"] ?? "";
  $email     = $body["email"] ?? "";
  $phone     = $body["phone"] ?? null;
  $address   = $body["address"] ?? null;
  $status    = $body["status"] ?? "ACTIVE";
  $password  = $body["password"] ?? "";

  if (!$full_name || !$username || !$email || !$password) json_out(["error"=>"Missing fields"], 400);

  $hash = password_hash($password, PASSWORD_BCRYPT);

  $stmt = $pdo->prepare("INSERT INTO student(full_name,username,email,phone,address,status,password_hash) VALUES(?,?,?,?,?,?,?)");
  $stmt->execute([$full_name,$username,$email,$phone,$address,$status,$hash]);

  json_out(["ok"=>true,"student_id"=>$pdo->lastInsertId()]);
}

// -------- AUTH STUDENT LOGIN ----------
if ($method === "POST" && $path === "/api/auth/student/login") {
  $username = $body["username"] ?? "";
  $password = $body["password"] ?? "";

  $stmt = $pdo->prepare("SELECT * FROM student WHERE username=?");
  $stmt->execute([$username]);
  $u = $stmt->fetch();

  if (!$u || !password_verify($password, $u["password_hash"])) json_out(["error"=>"Invalid login"], 401);

  json_out(["role"=>"student","student_id"=>$u["student_id"],"username"=>$u["username"],"full_name"=>$u["full_name"]]);
}

// -------- TEACHER REGISTER ----------
if ($method === "POST" && $path === "/api/auth/teacher/register") {
  $full_name = $body["full_name"] ?? "";
  $username  = $body["username"] ?? "";
  $email     = $body["email"] ?? "";
  $phone     = $body["phone"] ?? null;
  $subject   = $body["subject"] ?? null;
  $password  = $body["password"] ?? "";

  if (!$full_name || !$username || !$email || !$password) json_out(["error"=>"Missing fields"], 400);

  $hash = password_hash($password, PASSWORD_BCRYPT);

  $stmt = $pdo->prepare("INSERT INTO teacher(full_name,username,email,phone,subject,password_hash) VALUES(?,?,?,?,?,?)");
  $stmt->execute([$full_name,$username,$email,$phone,$subject,$hash]);

  json_out(["ok"=>true,"teacher_id"=>$pdo->lastInsertId()]);
}

// -------- TEACHER LOGIN ----------
if ($method === "POST" && $path === "/api/auth/teacher/login") {
  $username = $body["username"] ?? "";
  $password = $body["password"] ?? "";

  $stmt = $pdo->prepare("SELECT * FROM teacher WHERE username=?");
  $stmt->execute([$username]);
  $u = $stmt->fetch();

  if (!$u || !password_verify($password, $u["password_hash"])) json_out(["error"=>"Invalid login"], 401);

  json_out(["role"=>"teacher","teacher_id"=>$u["teacher_id"],"username"=>$u["username"],"full_name"=>$u["full_name"]]);
}

// -------- GET CLASSES ----------
if ($method === "GET" && $path === "/api/classes") {
  $rows = $pdo->query("
    SELECT c.*, t.full_name AS teacher_full_name
    FROM class c
    JOIN teacher t ON t.teacher_id = c.teacher_id
    ORDER BY c.class_id DESC
  ")->fetchAll();

  json_out($rows);
}

// -------- CREATE CLASS ----------
if ($method === "POST" && $path === "/api/classes") {
  $class_name    = $body["class_name"] ?? "";
  $subject       = $body["subject"] ?? null;
  $grade         = $body["grade"] ?? null;
  $schedule_day  = $body["schedule_day"] ?? null;
  $schedule_time = $body["schedule_time"] ?? null;
  $monthly_fee   = $body["monthly_fee"] ?? 0;
  $teacher_id    = $body["teacher_id"] ?? null;

  if (!$class_name || !$teacher_id) json_out(["error"=>"Missing fields"], 400);

  $stmt = $pdo->prepare("INSERT INTO class(class_name,subject,grade,schedule_day,schedule_time,monthly_fee,teacher_id)
                         VALUES(?,?,?,?,?,?,?)");
  $stmt->execute([$class_name,$subject,$grade,$schedule_day,$schedule_time,$monthly_fee,$teacher_id]);

  json_out(["ok"=>true,"class_id"=>$pdo->lastInsertId()]);
}

// -------- ENROLL STUDENT ----------
if ($method === "POST" && $path === "/api/enrollments") {
  $student_id = $body["student_id"] ?? null;
  $class_id = $body["class_id"] ?? null;
  $enroll_status = $body["enroll_status"] ?? "ACTIVE";

  if (!$student_id || !$class_id) json_out(["error"=>"Missing fields"], 400);

  $stmt = $pdo->prepare("INSERT INTO enrollment(student_id,class_id,enroll_status) VALUES(?,?,?)");
  $stmt->execute([$student_id,$class_id,$enroll_status]);

  json_out(["ok"=>true,"enrollment_id"=>$pdo->lastInsertId()]);
}

// -------- CREATE ATTENDANCE SESSION ----------
if ($method === "POST" && $path === "/api/attendance/sessions") {
  $class_id = $body["class_id"] ?? null;
  $session_date = $body["session_date"] ?? null;
  $start_time = $body["start_time"] ?? null;
  $end_time = $body["end_time"] ?? null;

  if (!$class_id || !$session_date) json_out(["error"=>"Missing fields"], 400);

  $stmt = $pdo->prepare("INSERT INTO attendance_session(class_id,session_date,start_time,end_time) VALUES(?,?,?,?)");
  $stmt->execute([$class_id,$session_date,$start_time,$end_time]);

  json_out(["ok"=>true,"session_id"=>$pdo->lastInsertId()]);
}

// -------- MARK ATTENDANCE ----------
if ($method === "POST" && $path === "/api/attendance/mark") {
  $session_id = $body["session_id"] ?? null;
  $student_id = $body["student_id"] ?? null;
  $status = $body["status"] ?? null; // PRESENT/ABSENT
  $note = $body["note"] ?? null;

  if (!$session_id || !$student_id || !$status) json_out(["error"=>"Missing fields"], 400);

  // UPSERT (insert or update)
  $stmt = $pdo->prepare("
    INSERT INTO attendance(session_id,student_id,status,note)
    VALUES(?,?,?,?)
    ON DUPLICATE KEY UPDATE status=VALUES(status), note=VALUES(note)
  ");
  $stmt->execute([$session_id,$student_id,$status,$note]);

  json_out(["ok"=>true]);
}

// -------- PAYMENTS LIST ----------
if ($method === "GET" && $path === "/api/payments") {
  $status = $_GET["status"] ?? null;

  if ($status) {
    $stmt = $pdo->prepare("
      SELECT p.*, s.full_name AS student_name, c.class_name
      FROM payment p
      JOIN student s ON s.student_id=p.student_id
      JOIN class c ON c.class_id=p.class_id
      WHERE p.pay_status=?
      ORDER BY p.payment_id DESC
    ");
    $stmt->execute([$status]);
    json_out($stmt->fetchAll());
  } else {
    $rows = $pdo->query("
      SELECT p.*, s.full_name AS student_name, c.class_name
      FROM payment p
      JOIN student s ON s.student_id=p.student_id
      JOIN class c ON c.class_id=p.class_id
      ORDER BY p.payment_id DESC
    ")->fetchAll();
    json_out($rows);
  }
}

// -------- UPSERT PAYMENT ----------
if ($method === "POST" && $path === "/api/payments") {
  $student_id = $body["student_id"] ?? null;
  $class_id = $body["class_id"] ?? null;
  $month = $body["month"] ?? null;          // 2026-02
  $amount = $body["amount"] ?? null;
  $paid_date = $body["paid_date"] ?? null;  // yyyy-mm-dd
  $methodPay = $body["method"] ?? "CASH";
  $pay_status = $body["pay_status"] ?? "PENDING";
  $receipt_no = $body["receipt_no"] ?? null;

  if (!$student_id || !$class_id || !$month || !$amount) json_out(["error"=>"Missing fields"], 400);

  $stmt = $pdo->prepare("
    INSERT INTO payment(student_id,class_id,month,amount,paid_date,method,pay_status,receipt_no)
    VALUES(?,?,?,?,?,?,?,?)
    ON DUPLICATE KEY UPDATE
      amount=VALUES(amount),
      paid_date=VALUES(paid_date),
      method=VALUES(method),
      pay_status=VALUES(pay_status),
      receipt_no=VALUES(receipt_no)
  ");
  $stmt->execute([$student_id,$class_id,$month,$amount,$paid_date,$methodPay,$pay_status,$receipt_no]);

  json_out(["ok"=>true]);
}

json_out(["error"=>"Not found", "path"=>$path], 404);
