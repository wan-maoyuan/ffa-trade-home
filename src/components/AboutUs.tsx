import { useEffect, useState, ChangeEvent, FormEvent } from 'react'
import './AboutUs.css'
import backgroundImage from '../assets/images/about-us-background.jpeg'
import guanDaYu from '../assets/images/guan-da-yu.png'
import zhaoKaiYuan from '../assets/images/zhao-kai-yuan.png'
import liSheng from '../assets/images/li-sheng.png'
import chooseUsBackground from '../assets/images/choose-us-background.jpeg'
import logoFont from '../assets/images/logo-font.png'
import servicesDiagram from '../assets/images/services-diagram.png'

const AboutUs = () => {
  const [activeSection, setActiveSection] = useState('company-intro')
  const [contactForm, setContactForm] = useState({
    company: '',
    message: '',
    name: '',
    email: '',
    phone: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error'
    message: string
  } | null>(null)

  useEffect(() => {
    const handleScroll = () => {
      const sections = [
        'company-intro',
        'core-team',
        'products-services',
        'choose-us',
        'contact-us'
      ]
      
      const scrollPosition = window.scrollY + window.innerHeight / 2

      for (const sectionId of sections) {
        const element = document.getElementById(sectionId)
        if (element) {
          const { offsetTop, offsetHeight } = element
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(sectionId)
            break
          }
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const handleInputChange =
    (field: keyof typeof contactForm) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { value } = event.target
    setContactForm((prev) => ({
      ...prev,
      [field]: value
    }))
    if (submitStatus) {
      setSubmitStatus(null)
    }
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (isSubmitting) {
      return
    }

    const trimmedForm = Object.entries(contactForm).reduce((acc, [key, value]) => {
      acc[key as keyof typeof contactForm] = value.trim()
      return acc
    }, { ...contactForm })

    const hasEmptyField = Object.values(trimmedForm).some((value) => !value)

    if (hasEmptyField) {
      setSubmitStatus({
        type: 'error',
        message: '请填写完整信息后再提交。'
      })
      return
    }

    setIsSubmitting(true)
    setSubmitStatus(null)

    try {
      const params = new URLSearchParams({
        name: trimmedForm.name,
        phone: trimmedForm.phone,
        email: trimmedForm.email,
        company: trimmedForm.company,
        message: trimmedForm.message
      })

      const response = await fetch(
        `http://153.35.96.86:10014/api/home/home/contact?${params.toString()}`,
        {
          method: 'POST',
          headers: {
            accept: 'application/json'
          }
        }
      )

      if (!response.ok) {
        throw new Error('网络请求失败')
      }

      setSubmitStatus({
        type: 'success',
        message: '提交成功，我们会尽快与您联系。'
      })
      setContactForm({
        company: '',
        message: '',
        name: '',
        email: '',
        phone: ''
      })
    } catch (error) {
      console.error('提交失败', error)
      setSubmitStatus({
        type: 'error',
        message: '提交失败，请稍后重试或直接联系我们。'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="about-us">
      {/* 顶部背景图和标题 */}
      <section className="hero-section">
        <img 
          src={backgroundImage}
          alt="船舶背景"
          className="about-us-background"
        />
        <div className="hero-overlay" />
        <div className="hero-content">
          <h1 className="hero-title">AQUABRIDGE</h1>
          <p className="hero-subtitle-cn">一站式衍生品综合服务商</p>
          <p className="hero-subtitle-en">One Stop Derivatives Service Provider</p>
        </div>
      </section>

      {/* 左侧浮动快速跳转菜单 */}
      <nav className="side-menu">
        <div className="side-menu-items">
          <button
            className={`side-menu-item ${activeSection === 'company-intro' ? 'active' : ''}`}
            onClick={() => scrollToSection('company-intro')}
          >
            <span className="side-menu-title">公司简介</span>
            <span className="side-menu-subtitle">Company Profile</span>
          </button>
          <button
            className={`side-menu-item ${activeSection === 'core-team' ? 'active' : ''}`}
            onClick={() => scrollToSection('core-team')}
          >
            <span className="side-menu-title">核心团队</span>
            <span className="side-menu-subtitle">Core Team</span>
          </button>
          <button
            className={`side-menu-item ${activeSection === 'products-services' ? 'active' : ''}`}
            onClick={() => scrollToSection('products-services')}
          >
            <span className="side-menu-title">产品与服务</span>
            <span className="side-menu-subtitle">Products&Services</span>
          </button>
          <button
            className={`side-menu-item ${activeSection === 'choose-us' ? 'active' : ''}`}
            onClick={() => scrollToSection('choose-us')}
          >
            <span className="side-menu-title">选择我们</span>
            <span className="side-menu-subtitle">Choose Us</span>
          </button>
          <button
            className={`side-menu-item ${activeSection === 'contact-us' ? 'active' : ''}`}
            onClick={() => scrollToSection('contact-us')}
          >
            <span className="side-menu-title">联系我们</span>
            <span className="side-menu-subtitle">Contact Us</span>
          </button>
        </div>
      </nav>

      {/* 了解我们 */}
      <section id="company-intro" className="about-intro">
        <div className="about-intro-card">
          <div className="intro-top">
            <div className="intro-left">
              <h2 className="intro-title">了解我们</h2>
              <p className="intro-subtitle">About Us</p>
            </div>
            <div className="intro-right">
              <p className="intro-description">
                AquaBridge 是全球领先的一站式衍生品综合服务商，致力于通过创新金融工具赋能大宗商品贸易产业链。公司依托顶尖团队的专业能力和丰富的实战经验，为客户提供涵盖交易、资管、咨询、培训、外包及定制化服务的全方位解决方案，助力企业高效管理风险、优化资源配置。
              </p>
            </div>
          </div>
          <div className="intro-bottom">
            <p className="intro-label">我们提供</p>
            <div className="intro-services">
              <div className="service-item">
                <span className="service-number">01</span>
                <span className="service-name">信号</span>
                <p className="service-desc">
                  基于大数据与机器学习，构建高价值信号体系，精准赋能客户日常决策。
                </p>
              </div>
              <div className="service-item">
                <span className="service-number">02</span>
                <span className="service-name">策略</span>
                <p className="service-desc">
                  深耕实战策略开发，覆盖多元场景，驱动交易表现提升。
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 核心团队 */}
      <section id="core-team" className="core-team">
        <div className="section-header">
          <h2 className="section-title">核心团队</h2>
          <p className="section-subtitle">Core Team</p>
        </div>
        
        <div className="team-member team-member-left">
          <div className="member-card">
            <div className="member-image-container">
              <div className="member-background-block"></div>
              <img 
                src={guanDaYu}
                alt="管大宇"
                className="member-image"
              />
            </div>
            <div className="member-info">
              <h3 className="member-name">管大宇</h3>
              <p className="member-title">恒力衍生品学院院长</p>
              <p className="member-description">
                毕业于中国科技大学少年班。国内顶级期权实战专家，曾在全球金融市场创造8年300倍的收益率，培养出了 多位稳定盈利的优秀期权交易员。国内期权服务实体产业的开创者，累计实现大宗商品含权贸易额超过600亿元， 将中国大宗商品产业带进权现结合时代。多家交易所和金融机构特邀讲师，参与国内多个期权合约的设计。
              </p>
            </div>
          </div>
        </div>

        <div className="team-member team-member-right">
          <div className="member-card">
            <div className="member-image-container">
              <div className="member-background-block"></div>
              <img 
                src={zhaoKaiYuan}
                alt="赵开元"
                className="member-image"
              />
            </div>
            <div className="member-info">
              <h3 className="member-name">赵开元</h3>
              <p className="member-title">资深大宗商品航运、贸易专家</p>
              <p className="member-description">
                毕业于大连海事大学和长江商学院。资深大宗商品航运、贸易专家。曾完成价值超过10亿美金的散货船新造船项目 及项目融资。也曾为国内外头部粮食贸易商提供长期运费服务。曾任波罗的海交易所北美唯一报价会员 JFD 亚洲区负责人。
              </p>
            </div>
          </div>
        </div>

        <div className="team-member team-member-left">
          <div className="member-card">
            <div className="member-image-container">
              <div className="member-background-block"></div>
              <img 
                src={liSheng}
                alt="李昇"
                className="member-image"
              />
            </div>
            <div className="member-info">
              <h3 className="member-name">李昇</h3>
              <p className="member-title">无锡青科协理事会监事、人工智能专委会副主任</p>
              <p className="member-description">
                毕业于莫斯科国立大学（与Skoltech、MIT联合培养），江苏省青联委员、无锡市青联科技届别秘书长。国产远洋气象导航技术的破局者，主攻国产远洋气象导航核心技术，打破国外30年技术垄断，市场占有率第一。个人曾获行业最高奖项"中国气象服务协会科学技术一等奖"以及"数字中国人工智能赛道全国三等奖"等多项荣誉，拥有10余项发明专利，相关技术入选江苏省重点推广新技术目录，推动了人工智能技术在气象与航运领域的融创共进。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 一站式衍生品综合服务 */}
      <section id="products-services" className="comprehensive-services">
        <div className="services-white-card">
          <img 
            src={servicesDiagram}
            alt="一站式衍生品综合服务"
            className="services-diagram-image"
          />
        </div>
      </section>

      {/* 衍生品+ */}
      <section className="derivatives-plus">
        <div className="derivatives-plus-container">
          <div className="derivatives-plus-header">
            <div className="derivatives-icon">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g opacity="0.9">
                  <rect x="8" y="26" width="10" height="14" rx="1" fill="white"/>
                  <rect x="19" y="20" width="10" height="20" rx="1" fill="white"/>
                  <rect x="30" y="14" width="10" height="26" rx="1" fill="white"/>
                </g>
              </svg>
            </div>
            <div className="derivatives-header-text">
              <h2 className="derivatives-plus-title">衍生品+</h2>
            </div>
          </div>
          
          <p className="derivatives-plus-description">
            我们提供商品、货币、物流等多个领域的衍生品+服务，覆盖FFA、燃料油、碳税、利率、汇率等多个衍生品。
          </p>
          
          <div className="derivatives-diagram">
            {/* 流程图容器 */}
            <div className="derivatives-flow-wrapper">
              {/* 第一层：贸易 */}
              <div className="flow-layer flow-layer-1">
                <div className="flow-card">贸易</div>
              </div>

              {/* 箭头层 1 */}
              <div className="arrow-layer arrow-layer-1">
                <svg className="arrow-svg" viewBox="0 0 700 60" preserveAspectRatio="xMidYMid meet">
                  <defs>
                    <marker id="arrowhead1" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
                      <polygon points="0 0, 8 4, 0 8" fill="white" opacity="0.8"/>
                    </marker>
                  </defs>
                  <line x1="350" y1="5" x2="180" y2="55" stroke="white" strokeWidth="2" opacity="0.8" markerEnd="url(#arrowhead1)"/>
                  <line x1="350" y1="5" x2="350" y2="55" stroke="white" strokeWidth="2" opacity="0.8" markerEnd="url(#arrowhead1)"/>
                  <line x1="350" y1="5" x2="520" y2="55" stroke="white" strokeWidth="2" opacity="0.8" markerEnd="url(#arrowhead1)"/>
                </svg>
              </div>

              {/* 第二层：商品、货币、物流 */}
              <div className="flow-layer flow-layer-2">
                <div className="flow-card">商品</div>
                <div className="flow-card">货币</div>
                <div className="flow-card">物流</div>
              </div>

              {/* 箭头层 2 */}
              <div className="arrow-layer arrow-layer-2">
                <svg className="arrow-svg" viewBox="0 0 700 60" preserveAspectRatio="xMidYMid meet">
                  <defs>
                    <marker id="arrowhead2" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
                      <polygon points="0 0, 8 4, 0 8" fill="white" opacity="0.8"/>
                    </marker>
                  </defs>
                  {/* 从货币到利率和汇率 */}
                  <line x1="350" y1="5" x2="235" y2="55" stroke="white" strokeWidth="2" opacity="0.8" markerEnd="url(#arrowhead2)"/>
                  <line x1="350" y1="5" x2="315" y2="55" stroke="white" strokeWidth="2" opacity="0.8" markerEnd="url(#arrowhead2)"/>
                </svg>
              </div>

              {/* 第三层：利率、汇率、运输、仓储 */}
              <div className="flow-layer flow-layer-3">
                <div className="flow-card flow-card-pos1">利率</div>
                <div className="flow-card flow-card-pos2">汇率</div>
                <div className="flow-card flow-card-pos3">运输</div>
                <div className="flow-card flow-card-pos4">仓储</div>
              </div>

              {/* 箭头层 3 */}
              <div className="arrow-layer arrow-layer-3">
                <svg className="arrow-svg" viewBox="0 0 700 60" preserveAspectRatio="xMidYMid meet">
                  <defs>
                    <marker id="arrowhead3" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
                      <polygon points="0 0, 8 4, 0 8" fill="white" opacity="0.8"/>
                    </marker>
                  </defs>
                  {/* 从运输（第3列）到燃料油（第2列） */}
                  <line x1="415" y1="5" x2="290" y2="55" stroke="white" strokeWidth="2" opacity="0.8" markerEnd="url(#arrowhead3)"/>
                  {/* 从运输（第3列）到FFA（第3列） */}
                  <line x1="415" y1="5" x2="415" y2="55" stroke="white" strokeWidth="2" opacity="0.8" markerEnd="url(#arrowhead3)"/>
                  {/* 从运输（第3列）到碳税（第4列） */}
                  <line x1="415" y1="5" x2="540" y2="55" stroke="white" strokeWidth="2" opacity="0.8" markerEnd="url(#arrowhead3)"/>
                </svg>
              </div>

              {/* 第四层：燃料油、FFA、碳税 */}
              <div className="flow-layer flow-layer-4">
                <div className="flow-card flow-card-pos2">燃料油</div>
                <div className="flow-card flow-card-highlight flow-card-pos3">FFA</div>
                <div className="flow-card flow-card-pos4">碳税</div>
              </div>

              {/* 弧形包围线 */}
              <div className="curved-border-wrapper">
                <svg className="curved-border-svg" viewBox="0 0 500 80" preserveAspectRatio="xMidYMid meet">
                  <path d="M 50 10 Q 50 5, 55 5 L 445 5 Q 450 5, 450 10 L 450 70 Q 450 75, 445 75 L 55 75 Q 50 75, 50 70 Z" 
                        fill="none" 
                        stroke="white" 
                        strokeWidth="2" 
                        strokeDasharray="8,4" 
                        opacity="0.6"/>
                </svg>
              </div>

              {/* 第五层：衍生品 */}
              <div className="flow-layer flow-layer-5">
                <div className="flow-card flow-card-outline">衍生品</div>
              </div>
            </div>
          </div>
          
          <p className="derivatives-plus-footer">Derivatives Plus</p>
        </div>
      </section>

      {/* 为什么选择我们 */}
      <section id="choose-us" className="why-choose">
        <div className="why-choose-background">
          <img 
            src={chooseUsBackground}
            alt="背景"
            className="why-choose-bg-image"
          />
        </div>
        <div className="why-choose-overlay" />
        <div className="why-choose-content">
          <div className="section-header">
            <h2 className="section-title">为什么选择我们</h2>
            <p className="section-subtitle">Why Choose Us</p>
          </div>
          <ul className="why-choose-list">
            <li>专业、全面、定制化的衍生品综合服务</li>
            <li>专业团队，实战经验丰富</li>
            <li>一站式综合服务，覆盖全业务需求</li>
            <li>聚焦实体需求，深度结合贸易与金融</li>
            <li>科技赋能，智能风控与高效执行</li>
            <li>全球资源，本土化服务</li>
          </ul>
        </div>
      </section>

      {/* 公司介绍和联系方式 */}
      <footer id="contact-us" className="footer">
        <div className="footer-content">
          <div className="footer-section footer-section-info">
            <div className="footer-logo">
              <img 
                // src="https://www.figma.com/api/mcp/asset/0cd12cc7-1914-43a5-8107-ee37b1177ba8" 
                src={logoFont}
                alt="AQUABRIDGE"
                className="footer-logo-image"
              />
            </div>
            <p className="footer-cta">联系我们，开启您的衍生品+战略</p>
            <div className="footer-contact">
              <p className="contact-label">我们的联系方式：</p>
              <p className="contact-info">ffa@aquabridge.ai</p>
              <p className="contact-info">Terry Zhao +86 1360105560</p>
              {/* <p className="contact-info">Cathy Guan xxx</p> */}
            </div>
          </div>

          <div className="footer-section footer-section-form">
            <h3 className="footer-section-title">您的信息</h3>
            <form className="footer-form" onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="公司："
                value={contactForm.company}
                onChange={handleInputChange('company')}
                autoComplete="organization"
              />
              <textarea
                placeholder="业务和诉求："
                value={contactForm.message}
                onChange={handleInputChange('message')}
                rows={3}
              />
              <input
                type="text"
                placeholder="联系人："
                value={contactForm.name}
                onChange={handleInputChange('name')}
                autoComplete="name"
              />
              <input
                type="email"
                placeholder="邮件："
                value={contactForm.email}
                onChange={handleInputChange('email')}
                autoComplete="email"
              />
              <input
                type="tel"
                placeholder="电话："
                value={contactForm.phone}
                onChange={handleInputChange('phone')}
                autoComplete="tel"
              />
              <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? '提交中…' : '提交信息'}
              </button>
              {submitStatus && (
                <p className={`footer-form-message ${submitStatus.type}`}>
                  {submitStatus.message}
                </p>
              )}
            </form>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default AboutUs

