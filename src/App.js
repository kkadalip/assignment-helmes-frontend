import React, {Suspense, useEffect, useState} from 'react';
import 'primereact/resources/themes/nova-light/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import {ProgressSpinner} from 'primereact/progressspinner';
import {SelectButton} from 'primereact/selectbutton';
import {Button} from 'primereact/button';
import {useTranslation} from 'react-i18next';
import logo from './logo.svg';
import './main.css';
import axios from "axios/index";
import i18n from "./translations/i18n";

function Page() {

	const apiRoot = 'http://localhost:8090/api/';
	const urlSectors = apiRoot + 'sectors';
	const langSelectItems = [
		{label: 'English', value: 'en'},
		{label: 'Eesti', value: 'et'}
	];

	const initialData = Object.freeze({
		loadingSectors: true,
		id: 0,
		username: "",
		// allSectors: [],
		selectedSectors: [],
		agreedToTerms: false
	});
	let [formData, setFormData] = useState(initialData);
	let [isLoadingSectors, setIsLoadingSectors] = useState(initialData.loadingSectors);
	// let [allSectors, setAllSectors] = useState(initialData.allSectors);
	let [selectedSectors, setSelectedSectors] = useState(initialData.selectedSectors);

	useEffect(() => {
		const savedLanguage = localStorage.getItem('SelectedLanguage') || 'en';
		changeLanguage(savedLanguage);
		getSectors();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const {t, i18n} = useTranslation();
	const changeLanguage = lng => {
		i18n.changeLanguage(lng).then(() => {
					localStorage.setItem('SelectedLanguage', lng);
				}
		);
	};

	const getSectors = () => {
		axios.get(urlSectors)
				.then(res => res.data)
				.then(data => {
							setIsLoadingSectors(false);
							// setAllSectors(data);
							setSelectedSectors(data);
							// console.log("Sectors data is: ", data); // DEBUG
						}
				)
				.catch((err) => {
					console.error("Could not fetch Sectors data ", err);
				}, [])
	};

	const handleChangeInput = (event) => {
		console.log(formData);
		setFormData({
			...formData,
			[event.target.name]: event.target.value.trim()
		});
	};

	const handleChangeSelect = (event) => {
		let selectedOptions = [...event.target.options].filter(o => o.selected).map(o => o.value);
		console.log("SELECTED SECTORS ARE " + JSON.stringify(selectedOptions));
		setFormData({
			...formData,
			selectedSectors: selectedOptions
		});
		console.log(formData);
	};

	const handleChangeCheckbox = (event) => {
		setFormData({
			...formData,
			[event.target.name]: event.target.checked
		});
		// console.log(formData); // DEBUG
	};

	const SectorsList = ({data}) => {
		return <select multiple size="30" value={selectedSectors} onChange={handleChangeSelect}>
			<React.Fragment>{createSectorsTable(data)}</React.Fragment>
		</select>
	}

	function createSectorsTable(items, currentlevel) {
		let level = 0;
		if (currentlevel !== undefined) {
			level = currentlevel;
		}
		return items.map(function (item, index) {
					let hasChildSectors = item.childSectors && item.childSectors.length > 0;
					let spacer = "\u00A0\u00A0\u00A0\u00A0".repeat(level);
					return <React.Fragment key={index}>
						<option key={item.id} value={item.id}>{spacer} {t(item.name)}</option>
						{hasChildSectors && createSectorsTable(item.childSectors, level + 1)}
					</React.Fragment>
				}
		);
	}

	const handleSubmit = event => {
		console.log(formData);
		axios.post(apiRoot + 'save', {
			id: formData.id,
			username: formData.username,
			selectedSectors: formData.selectedSectors,
			agreedToTerms: formData.agreedToTerms
		})
				.then(function (response) {
					console.log(response);
				})
				.catch(function (error) {
					console.log(error);
				});
		event.preventDefault()
	}

	return <div className="app">
		<div className="lang-title-and-main">
			<div className="select-language-button-wrapper">
				<SelectButton value={i18n.language} options={langSelectItems} onChange={(e) => changeLanguage(e.value)} className='select-language-button'/>
			</div>
			<div className="title-and-main">
				<header>
					<div className="unselectable title-big">
						<span>{t('title.main')}</span>
					</div>
				</header>
				<div hidden={!isLoadingSectors}>
					<ProgressSpinner/>
				</div>
				<div hidden={isLoadingSectors} className="main">
					<form onSubmit={handleSubmit}>
						<div className="main-content">
							<div className="data-block">
								<span className="unselectable">{t('content.please-enter-data')}</span>
							</div>
							<div className="data-block">
								<label>
									<span className="row-title unselectable">{t('content.name')}</span>
									<input type="text" name="username" onChange={handleChangeInput}/>
								</label>
							</div>
							<div className="data-block">
								<label>
									<span className="row-title unselectable align-top">{t('content.sectors')}</span>
									{/*<SectorsList data={allSectors}/>*/}
									<SectorsList data={selectedSectors}/>
								</label>
							</div>
							<div className="data-block">
								<label>
									<input type="checkbox" name="agreedToTerms" className="row-title" onChange={handleChangeCheckbox}/>
									<span className="row-title unselectable">{t('content.agreed-to-terms')}</span>
								</label>
							</div>
							<div className="submit-block">
								<Button label={t('content.save')}/>
							</div>
						</div>
					</form>
				</div>
			</div>
		</div>
	</div>
}

const Loader = () => (
		<div className="app">
			<img src={logo} className="App-logo" alt="logo"/>
			<div>loading...</div>
		</div>
);

export default function App() {
	return (
			<Suspense fallback={<Loader/>}>
				<Page/>
			</Suspense>
	);
}