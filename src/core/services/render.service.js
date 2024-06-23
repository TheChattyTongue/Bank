import { ChildComponent } from '../component/child.component'

class RenderService {
	htmlToElement(html, components = [], styles) {
		const template = document.createElement('template')
		template.innerHTML = html.trim()

		const element = template.content.firstChild

		if (styles) {
			this.#applyModuleStyles(styles, element)
		}

		this.#replaceComponentTags(element, components)

		return element
	}

	#replaceComponentTags(parentElement, components) {
		const componentTagPattern = /^component-/
		const allElements = parentElement.getElementsByTagName('*')

		for (const element of allElements) {
			if (componentTagPattern.test(element.tagName.toLowerCase())) {
				const componentName = element.tagName
					.toLowerCase()
					.replace(componentTagPattern, '')
					.replace(/-/g, '')

				const findComponent = components.find(component => {
					const instance =
						component instanceof ChildComponent ? component : new component()

					return instance.constructor.name.toLowerCase() === componentName
				})

				if (findComponent) {
					const componentContent =
						findComponent instanceof ChildComponent
							? findComponent.render()
							: new findComponent().render()
					element.replaceWith(componentContent)
				} else {
					console.error(`Component "${componentName}" not found`)
				}
			}
		}
	}

	#applyModuleStyles(moduleStyles, element) {
		if (!element) return

		const applyStyles = element => {
			for (const [key, value] of Object.entries(moduleStyles)) {
				if (element.classList.contains(key)) {
					element.classList.remove(key)
					element.classList.add(value)
				}
			}
		}

		if (element.getAttribute('class')) {
			applyStyles(element)
		}

		const elements = element.querySelectorAll('*')
		elements.forEach(applyStyles)
	}
}

export default new RenderService()
