import React from 'react'
import {utils, writeFile} from 'xlsx'
import {Button, Row} from "antd";

interface Response {
    answerType: number
    inputValue: string
    otherMessage: string
    question: string
    tag: string
}

interface UserInfo {
    [pubkey: string]: {
        display_name: string
    }
}

export const Export: React.FC<{responses: {plaintext: string, pubkey: string}[], userInfo: any}> = (props) => {
    const onDownloadClick = (type: 'csv' | 'excel') => {
        const responses = props.responses.map(({plaintext}) => JSON.parse(plaintext)) as Response[][]
        const parsedResponse = responses
            .map((response, index) => {
                const resp = {
                    User: props.userInfo[props.responses[index].pubkey]?.display_name ?? 'Anonymous Response'
                }
                response
                    .reduce<Record<string, string>>((newResponse, answer) => {
                        newResponse[answer.question] = answer.inputValue
                        return newResponse
                    }, resp)
                return resp
            })
        const workSheet = utils.json_to_sheet(parsedResponse)
        const workBook = utils.book_new()
        utils.book_append_sheet(workBook, workSheet, 'Responses')
        if(type === 'excel') {
            writeFile(workBook, 'Responses.xlsx')
        } else {
            writeFile(workBook, 'Responses.csv')
        }
    }
    return (
        <Row>
            <Button onClick={() =>onDownloadClick('excel')}>Export as Excel</Button>
            <Button onClick={() =>onDownloadClick('csv')}>Export as CSV</Button>
        </Row>
    )
}