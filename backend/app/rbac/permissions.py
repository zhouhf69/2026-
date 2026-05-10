ROLE_MENU_SCOPE = {
    "SuperAdmin": ["*"],
    "HospitalAdmin": ["dashboard", "preparations", "projects", "cases", "wounds", "followups", "sops", "audit", "settings"],
    "DepartmentDirector": ["dashboard", "projects", "cases", "wounds", "followups", "sops", "stats"],
    "PI": ["dashboard", "projects", "cases", "wounds", "followups", "sops", "ai", "stats"],
    "Doctor": ["dashboard", "cases", "wounds", "followups", "ai"],
    "Nurse": ["cases", "wounds", "followups"],
    "Pharmacist": ["preparations", "projects", "audit"],
    "CRC": ["projects", "cases", "followups", "sops", "audit"],
    "ResearchAssistant": ["projects", "cases", "stats"],
    "EnterprisePartner": ["transformation", "evidence"],
    "Viewer": ["dashboard"],
}
