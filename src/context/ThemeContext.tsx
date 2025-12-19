import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'dark' | 'light';

interface ThemeContextType {
    theme: Theme;
    toggleTheme: () => void;
    setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // 默认使用夜晚主题，优先使用 HTML 中的 data-theme 属性（已在 index.html 中设置为 'dark'）
    const [theme, setThemeState] = useState<Theme>(() => {
        if (typeof window !== 'undefined') {
            // 优先检查 HTML 元素的 data-theme 属性（这是页面加载时的默认值）
            const htmlTheme = document.documentElement.getAttribute('data-theme') as Theme;
            if (htmlTheme === 'dark' || htmlTheme === 'light') {
                // 如果 HTML 中没有设置或者不是有效的主题值，强制设置为 'dark'
                if (!htmlTheme) {
                    document.documentElement.setAttribute('data-theme', 'dark');
                    document.documentElement.classList.add('dark');
                    return 'dark';
                }
                return htmlTheme;
            }
            // 如果 HTML 中没有有效的主题值，强制使用 dark 作为默认值
            document.documentElement.setAttribute('data-theme', 'dark');
            document.documentElement.classList.add('dark');
            return 'dark';
        }
        // SSR 或非浏览器环境，返回 dark
        return 'dark';
    });

    useEffect(() => {
        const root = window.document.documentElement;
        // Remove previous theme class/attribute
        root.classList.remove('light', 'dark');
        // Add new class or data-attribute
        root.setAttribute('data-theme', theme);
        root.classList.add(theme); // Some systems might use classes
        
        // Save to local storage
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setThemeState(prev => prev === 'dark' ? 'light' : 'dark');
    };

    const setTheme = (newTheme: Theme) => {
        setThemeState(newTheme);
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};
