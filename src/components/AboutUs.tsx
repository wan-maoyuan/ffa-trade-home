import { useEffect, useState } from 'react'
import './AboutUs.css'
import backgroundImage from '../assets/images/about-us-background.jpeg'

const AboutUs = () => {
  const [activeSection, setActiveSection] = useState('company-intro')

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
                src="https://www.figma.com/api/mcp/asset/fbd3a450-388b-4558-bd34-c6df2ea22ed0" 
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
                src="https://www.figma.com/api/mcp/asset/19917b85-155f-4d17-8c14-8920235fb2a1" 
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
      </section>

      {/* 一站式衍生品综合服务 */}
      <section id="products-services" className="comprehensive-services">
        <div className="services-white-card">
          {/* 图标 - 左上角 使用 Figma 提供的图标 */}
          <div className="services-icon">
            <svg width="65" height="65" viewBox="0 0 65 65" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g>
                <path d="M13.5 48.75L13.5 18.75L48.75 18.75L48.75 48.75L43.125 48.75L43.125 56.25L19.375 56.25L19.375 48.75L13.5 48.75Z" fill="white" stroke="white" strokeWidth="1.5"/>
                <rect x="5.5" y="5.5" width="37" height="37" rx="2" fill="white" stroke="white" strokeWidth="1"/>
                <path d="M16.25 32.5L16.25 16.25L32.5 16.25L32.5 32.5L29.375 32.5L29.375 37.5L19.375 37.5L19.375 32.5L16.25 32.5Z" fill="#2E56A3"/>
              </g>
            </svg>
          </div>
          
          {/* 标题和描述 */}
          <div className="services-header">
            <h2 className="services-title">一站式衍生品综合服务</h2>
            <p className="services-description">
              我们提供一站式衍生品综合服务，涵盖培训、咨询、投研、交易、外包、资管等多个领域。
            </p>
          </div>
          
          {/* 服务布局图 */}
          <div className="services-diagram-wrapper">
            <div className="services-diagram-container">
              {/* 虚线边框 - 只包含培训、服务、咨询、投研 */}
              <div className="services-dashed-border"></div>
              
              {/* 虚线框内的服务卡片 */}
              <div className="service-card service-card-peixun">
                <span>培训</span>
              </div>
              <div className="service-card service-card-fuwu">
                <span>服务</span>
              </div>
              <div className="service-card service-card-zixun">
                <span>咨询</span>
              </div>
              <div className="service-card service-card-touyan">
                <span>投研</span>
              </div>
              
              {/* 虚线框外的服务卡片 */}
              <div className="service-card service-card-jiaoyi">
                <span>交易</span>
              </div>
              <div className="service-card-external service-card-waibao">
                <span>外包</span>
              </div>
              <div className="service-card-external service-card-ziguan">
                <span>资管</span>
              </div>
              
              {/* 连接线和箭头 */}
              <svg className="services-connections" viewBox="0 0 750 270" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* 培训 -> 服务 水平箭头 */}
                <line x1="125" y1="69" x2="175" y2="69" stroke="#4669B2" strokeWidth="2"/>
                <polygon points="175,69 170,67 170,71" fill="#4669B2"/>
                
                {/* 服务 <-> 交易 双向箭头 */}
                <line x1="290" y1="61" x2="340" y2="61" stroke="#4669B2" strokeWidth="2"/>
                <polygon points="340,61 335,59 335,63" fill="#4669B2"/>
                <line x1="340" y1="77" x2="290" y2="77" stroke="#4669B2" strokeWidth="2"/>
                <polygon points="290,77 295,75 295,79" fill="#4669B2"/>
                
                {/* 培训 -> 咨询 垂直箭头 */}
                <line x1="63" y1="107" x2="63" y2="145" stroke="#4669B2" strokeWidth="2"/>
                <polygon points="63,145 61,140 65,140" fill="#4669B2"/>
                
                {/* 服务 -> 投研 垂直箭头 */}
                <line x1="228" y1="107" x2="228" y2="145" stroke="#4669B2" strokeWidth="2"/>
                <polygon points="228,145 226,140 230,140" fill="#4669B2"/>
                
                {/* 咨询 -> 投研 水平箭头 */}
                <line x1="125" y1="184" x2="175" y2="184" stroke="#4669B2" strokeWidth="2"/>
                <polygon points="175,184 170,182 170,186" fill="#4669B2"/>
                
                {/* 交易 -> 外包 斜向箭头 */}
                <line x1="455" y1="55" x2="535" y2="30" stroke="#4669B2" strokeWidth="2"/>
                <polygon points="535,30 530,32 532,27" fill="#4669B2"/>
                
                {/* 交易 -> 资管 斜向箭头 */}
                <line x1="455" y1="83" x2="535" y2="218" stroke="#4669B2" strokeWidth="2"/>
                <polygon points="535,218 530,216 532,221" fill="#4669B2"/>
              </svg>
            </div>
            
            <p className="services-footer">One-Stop Comprehensive Derivatives Services</p>
          </div>
        </div>
      </section>

      {/* 衍生品+ */}
      <section className="derivatives-plus">
        <div className="derivatives-plus-content">
          <h2 className="derivatives-plus-title">衍生品+</h2>
          <p className="derivatives-plus-description">
            我们提供商品、货币、物流等多个领域的衍生品+服务，覆盖FFA、燃料油、碳税、利率、汇率等多个衍生品。
          </p>
          <div className="derivatives-diagram">
            <img 
              src="https://www.figma.com/api/mcp/asset/51ecb8bd-d07a-4c92-abe2-48a078dc3a94" 
              alt="衍生品+"
              className="derivatives-image"
            />
          </div>
          <p className="derivatives-plus-footer">Derivatives Plus</p>
        </div>
      </section>

      {/* 为什么选择我们 */}
      <section id="choose-us" className="why-choose">
        <div className="why-choose-background">
          <img 
            src="https://www.figma.com/api/mcp/asset/ae62eeed-99ee-4557-9b26-946e71306e59" 
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
          <div className="footer-section">
            <div className="footer-logo">
              <img 
                src="https://www.figma.com/api/mcp/asset/0cd12cc7-1914-43a5-8107-ee37b1177ba8" 
                alt="AQUABRIDGE"
                className="footer-logo-image"
              />
            </div>
            <p className="footer-cta">联系我们，开启您的衍生品+战略</p>
            <div className="footer-contact">
              <p className="contact-label">我们的联系方式：</p>
              <p className="contact-info">ffa@aquabridge.ai</p>
              <p className="contact-info">Terry Zhao +86 1360105560</p>
              <p className="contact-info">Cathy Guan xxx</p>
            </div>
          </div>

          <div className="footer-section">
            <h3 className="footer-section-title">快速链接</h3>
            <ul className="footer-links">
              <li>首页</li>
              <li>产品与服务</li>
              <li>投资者关系</li>
              <li>关于我们</li>
            </ul>
          </div>

          <div className="footer-section">
            <h3 className="footer-section-title">您的信息</h3>
            <div className="footer-form">
              <input type="text" placeholder="公司：" />
              <input type="text" placeholder="业务和诉求：" />
              <input type="text" placeholder="联系人：" />
              <input type="email" placeholder="邮件：" />
              <input type="tel" placeholder="电话：" />
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default AboutUs

