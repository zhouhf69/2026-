from app.core.database import SessionLocal
from app.core.security import get_password_hash
from app.models import (
    Department,
    EvidencePackage,
    HospitalPreparation,
    ResearchProject,
    Role,
    SOPTemplate,
    SOPVersion,
    TransformationProject,
    User,
)

ROLE_CODES = [
    ("SuperAdmin", "超级管理员"),
    ("HospitalAdmin", "医院管理员"),
    ("DepartmentDirector", "科主任"),
    ("PI", "项目负责人"),
    ("Doctor", "医生"),
    ("Nurse", "护士"),
    ("Pharmacist", "药师"),
    ("CRC", "科研秘书"),
    ("ResearchAssistant", "研究助理"),
    ("EnterprisePartner", "企业合作方"),
    ("Viewer", "只读查看者"),
]

PREPARATIONS = [
    "复方黄柏液外用制剂",
    "生肌玉红膏",
    "肛周熏洗方",
    "造口护肤膏",
    "肠瘘创面湿敷方",
    "慢性创面生肌散",
    "糖足清创外洗方",
    "术后切口修复膏",
]

PROJECTS = [
    ("肠瘘创面外用制剂真实世界疗效观察", "RWS-2026-001"),
    ("生肌玉红膏促进慢性创面愈合的真实世界研究", "RWS-2026-002"),
    ("肛周熏洗方用于肛瘘术后疼痛与水肿改善的临床观察", "RWS-2026-003"),
    ("造口周围皮炎外用制剂疗效评价研究", "RWS-2026-004"),
]


def run() -> None:
    db = SessionLocal()
    try:
        role_map: dict[str, Role] = {}
        for code, name in ROLE_CODES:
            role = db.query(Role).filter(Role.code == code).first()
            if not role:
                role = Role(code=code, name=name, created_by="seed", updated_by="seed")
                db.add(role)
                db.flush()
            role_map[code] = role

        dept = db.query(Department).filter(Department.name == "创面修复中心").first()
        if not dept:
            dept = Department(name="创面修复中心", hospital_name="示例三甲医院", created_by="seed", updated_by="seed")
            db.add(dept)
            db.flush()

        admin = db.query(User).filter(User.username == "admin").first()
        if not admin:
            admin = User(
                username="admin",
                full_name="系统管理员",
                hashed_password=get_password_hash("Admin123!"),
                role_id=role_map["SuperAdmin"].id,
                department_id=dept.id,
                created_by="seed",
                updated_by="seed",
            )
            db.add(admin)

        pi_user = db.query(User).filter(User.username == "pi_demo").first()
        if not pi_user:
            pi_user = User(
                username="pi_demo",
                full_name="张主任",
                hashed_password=get_password_hash("Pi123456!"),
                role_id=role_map["PI"].id,
                department_id=dept.id,
                created_by="seed",
                updated_by="seed",
            )
            db.add(pi_user)

        for idx, prep_name in enumerate(PREPARATIONS, start=1):
            prep = db.query(HospitalPreparation).filter(HospitalPreparation.name == prep_name).first()
            if not prep:
                db.add(
                    HospitalPreparation(
                        prep_id=f"PREP-{idx:03d}",
                        name=prep_name,
                        prep_type="外用药",
                        dosage_form="膏剂",
                        indications="慢性创面、术后切口及相关皮损",
                        contraindications="对组方成分过敏者禁用",
                        usage_dosage="每日1-2次，遵医嘱外用",
                        evidence_level="III级",
                        created_by="seed",
                        updated_by="seed",
                    )
                )

        for project_name, project_code in PROJECTS:
            exists = db.query(ResearchProject).filter(ResearchProject.project_code == project_code).first()
            if not exists:
                db.add(
                    ResearchProject(
                        project_name=project_name,
                        project_code=project_code,
                        research_type="院内制剂疗效观察",
                        objective="评估院内制剂在真实世界临床路径中的疗效与安全性",
                        pi_name="张主任",
                        inclusion_criteria="18岁以上，符合临床诊断且签署知情同意",
                        exclusion_criteria="严重器官功能衰竭、研究者判断不适合入组",
                        followup_nodes="D1,D3,D7,D14,D30,D60,D90",
                        sample_target=120,
                        current_enrollment=0,
                        project_status="入组中",
                        created_by="seed",
                        updated_by="seed",
                    )
                )

        sop_template = db.query(SOPTemplate).filter(SOPTemplate.name == "创面图像采集SOP").first()
        if not sop_template:
            sop_template = SOPTemplate(
                name="创面图像采集SOP",
                sop_type="图像采集SOP",
                disease_scope="慢性创面",
                preparation_scope="通用",
                department_scope="创面中心",
                owner="护理组",
                created_by="seed",
                updated_by="seed",
            )

        transformation = db.query(TransformationProject).filter(TransformationProject.transformation_name == "生肌玉红膏慢性创面转化项目").first()
        if not transformation:
            transformation = TransformationProject(
                transformation_name="生肌玉红膏慢性创面转化项目",
                evidence_level="III级",
                market_potential="高",
                phase="真实世界研究",
                milestones="Q2完成证据包初稿，Q3开展多中心准备",
                created_by="seed",
                updated_by="seed",
            )
            db.add(transformation)

        evidence = db.query(EvidencePackage).filter(EvidencePackage.package_name == "生肌玉红膏证据包v1").first()
        if not evidence:
            db.add(
                EvidencePackage(
                    package_name="生肌玉红膏证据包v1",
                    package_type="真实世界研究报告",
                    status="生成中",
                    summary="包含疗效趋势、安全性评价、统计图表和SOP修订建议。",
                    created_by="seed",
                    updated_by="seed",
                )
            )
            db.add(sop_template)
            db.flush()
            db.add(
                SOPVersion(
                    sop_template_id=sop_template.id,
                    version_no="v1.0",
                    operation_steps="同角度、同距离、同光照拍摄，标尺入镜。",
                    qc_points="图像清晰、标尺可见、时间点准确",
                    risk_points="角度偏差导致面积估算失真",
                    ai_suggestion="建议统一使用标准拍摄模板",
                    created_by="seed",
                    updated_by="seed",
                )
            )

        db.commit()
        print("Seed completed. Admin: admin / Admin123!")
    finally:
        db.close()


if __name__ == "__main__":
    run()
