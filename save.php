<?php

header("Content-Type: application/json");


// Read JSON data
$json = file_get_contents("php://input");

$data = json_decode($json, true);


if (!$data) {

    echo json_encode([
        "success" => false,
        "message" => "Invalid data."
    ]);

    exit;
}


// ================================
// GET DATA
// ================================

$applicationNo = trim($data["applicationNo"] ?? "");
$mobile        = trim($data["mobile"] ?? "");
$name          = trim($data["name"] ?? "");
$district      = trim($data["district"] ?? "");
$block         = trim($data["block"] ?? "");
$gp            = trim($data["gp"] ?? "");
$ac            = trim($data["ac"] ?? "");
$remarks       = trim($data["remarks"] ?? "");


// ================================
// VALIDATION
// ================================

if (
    $applicationNo === "" ||
    $mobile === "" ||
    $name === "" ||
    $ac === ""
) {

    echo json_encode([
        "success" => false,
        "message" => "Required fields are missing."
    ]);

    exit;
}


if (!preg_match('/^[0-9]{10}$/', $mobile)) {

    echo json_encode([
        "success" => false,
        "message" => "Invalid mobile number."
    ]);

    exit;
}


// ================================
// CSV FILE
// ================================

$file = "new.csv";


// ================================
// CREATE FILE IF NOT EXISTS
// ================================

if (!file_exists($file)) {

    $handle = fopen($file, "w");

    if (!$handle) {

        echo json_encode([
            "success" => false,
            "message" => "Unable to create new.csv"
        ]);

        exit;
    }


    // CSV HEADER

    fputcsv($handle, [

        "Application No.",
        "Mobile",
        "Applicant Name",
        "District",
        "Block/Mun.",
        "GP/Ward",
        "AC",
        "Remarks",
        "Submitted Date"

    ]);

    fclose($handle);
}


// ================================
// APPEND NEW RECORD
// ================================

$handle = fopen($file, "a");


if (!$handle) {

    echo json_encode([
        "success" => false,
        "message" => "Unable to open new.csv"
    ]);

    exit;
}


// Lock file to prevent simultaneous writes

flock($handle, LOCK_EX);


fputcsv($handle, [

    $applicationNo,
    $mobile,
    $name,
    $district,
    $block,
    $gp,
    $ac,
    $remarks,
    date("Y-m-d H:i:s")

]);


flock($handle, LOCK_UN);

fclose($handle);


// ================================
// SUCCESS
// ================================

echo json_encode([

    "success" => true,

    "message" =>
        "Application saved successfully."

]);

?>
