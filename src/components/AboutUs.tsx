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
          className="hero-background"
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
        <div className="services-header">
          <h2 className="services-title">一站式衍生品综合服务</h2>
          <p className="services-description">
            我们提供一站式衍生品综合服务，涵盖培训、咨询、投研、交易、外包、资管等多个领域。
          </p>
        </div>
        <div className="services-diagram">
          <img 
            src="https://www.figma.com/api/mcp/asset/cb7ded95-b678-4d5d-8af2-c18c1e1d13b5" 
            alt="一站式服务"
            className="services-image"
          />
        </div>
        <p className="services-footer">One-Stop Comprehensive Derivatives Services</p>
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

