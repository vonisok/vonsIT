// Load shared header into all pages
(function() {
    // Determine the correct path based on current page location
    function getHeaderPath() {
        const path = window.location.pathname;
        // Remove filename and get directory depth
        const pathParts = path.split('/').filter(p => p && !p.includes('.html'));
        
        if (pathParts.length === 0) {
            return 'header.html';
        }
        // For pages in root, use header.html, otherwise use relative path
        return '../header.html';
    }
    
    // Fix image and link paths based on current page location
    function fixPaths(html, currentPath) {
        const isRoot = !currentPath.includes('/') || currentPath.split('/').length <= 2;
        
        if (!isRoot) {
            // If not in root, need to go up one level for images
            html = html.replace(/src="\/images\//g, 'src="../images/');
            html = html.replace(/href="\//g, 'href="../');
        }
        
        return html;
    }
    
    // Load header HTML
    const currentPath = window.location.pathname;
    fetch(getHeaderPath())
        .then(response => {
            if (!response.ok) {
                throw new Error('Header file not found');
            }
            return response.text();
        })
        .then(html => {
            // Fix paths based on current location
            html = fixPaths(html, currentPath);
            
            // Insert header before the first element in body or at the beginning
            const body = document.body;
            const headerContainer = document.createElement('div');
            headerContainer.innerHTML = html;
            
            const headerElement = headerContainer.firstElementChild;
            
            // Insert the header as the first child of body
            if (body.firstChild) {
                body.insertBefore(headerElement, body.firstChild);
            } else {
                body.appendChild(headerElement);
            }
            
            // Re-initialize mobile menu after header is loaded
            setTimeout(() => {
                const navToggle = document.querySelector('.nav-toggle');
                const navMenu = document.querySelector('.nav-menu');
                
                if (navToggle && navMenu) {
                    navToggle.addEventListener('click', function() {
                        navMenu.classList.toggle('active');
                        this.classList.toggle('active');
                    });
                    
                    // Close mobile menu when clicking on a link
                    document.querySelectorAll('.nav-menu a').forEach(link => {
                        link.addEventListener('click', () => {
                            navMenu.classList.remove('active');
                            navToggle.classList.remove('active');
                        });
                    });
                }
            }, 100);
        })
        .catch(error => {
            console.error('Error loading header:', error);
        });
})();


